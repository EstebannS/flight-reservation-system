const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    constructor(data = {}) {
        this.id = data.id;
        this.email = data.email;
        this.password_hash = data.password_hash;
        this.full_name = data.full_name;
        this.document_type = data.document_type || 'CC';
        this.document_number = data.document_number;
        this.phone = data.phone;
        this.birth_date = data.birth_date;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.last_login = data.last_login;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM users WHERE email = ? AND is_active = true',
                [email]
            );
            return rows.length ? new User(rows[0]) : null;
        } catch (error) {
            console.error('Error en User.findByEmail:', error);
            throw error;
        }
    }

    // Buscar usuario por email sin filtrar is_active (útil para chequear duplicados)
    static async findByEmailIncludeInactive(email) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows.length ? new User(rows[0]) : null;
        } catch (error) {
            console.error('Error en User.findByEmailIncludeInactive:', error);
            throw error;
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM users WHERE id = ? AND is_active = true',
                [id]
            );
            return rows.length ? new User(rows[0]) : null;
        } catch (error) {
            console.error('Error en User.findById:', error);
            throw error;
        }
    }

    // Crear nuevo usuario
    static async create(userData) {
        try {
            const {
                email,
                password,
                full_name,
                document_type = 'CC',
                document_number,
                phone,
                birth_date
            } = userData;

            // Validar que los campos requeridos no sean undefined
            if (!email || !password || !full_name || !document_number) {
                throw new Error('Campos requeridos faltantes');
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Asegurar que todos los valores sean null en lugar de undefined
            const values = [
                email,
                password_hash,
                full_name,
                document_type,
                document_number,
                phone || null,
                birth_date || null
            ];

            const [result] = await pool.execute(
                `INSERT INTO users 
         (email, password_hash, full_name, document_type, document_number, phone, birth_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                values
            );

            return await User.findById(result.insertId);
        } catch (error) {
            console.error('Error en User.create:', error);
            throw error;
        }
    }

    // Validar contraseña
    async validatePassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    // Establecer nueva contraseña (hash y guardar)
    async setPassword(newPassword) {
        try {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(newPassword, salt);
            await pool.execute(
                'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
                [password_hash, this.id]
            );
            this.password_hash = password_hash;
            return true;
        } catch (error) {
            console.error('Error en setPassword:', error);
            throw error;
        }
    }

    // Activar / desactivar usuario (usado para verificación por email)
    async setActive(isActive) {
        try {
            await pool.execute(
                'UPDATE users SET is_active = ? WHERE id = ?',
                [isActive ? 1 : 0, this.id]
            );
            this.is_active = !!isActive;
            return true;
        } catch (error) {
            console.error('Error en setActive:', error);
            throw error;
        }
    }
    // Actualizar último login
    async updateLastLogin() {
        try {
            await pool.execute(
                'UPDATE users SET last_login = NOW() WHERE id = ?',
                [this.id]
            );
            this.last_login = new Date();
            return true;
        } catch (error) {
            console.error('Error en updateLastLogin:', error);
            return false;
        }
    }

    // Actualizar perfil
    async update(updateData) {
        try {
            const fields = [];
            const values = [];

            // Construir query dinámica
            Object.keys(updateData).forEach(key => {
                if (key !== 'id' && key !== 'password_hash' && key !== 'created_at') {
                    fields.push(`${key} = ?`);
                    values.push(updateData[key] !== undefined ? updateData[key] : null);
                }
            });

            if (fields.length === 0) return this;

            values.push(this.id);

            await pool.execute(
                `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            // Recargar datos
            const updated = await User.findById(this.id);
            Object.assign(this, updated);
            return this;
        } catch (error) {
            console.error('Error en User.update:', error);
            throw error;
        }
    }

    // Eliminar usuario (soft delete)
    async delete() {
        try {
            await pool.execute(
                'UPDATE users SET is_active = false WHERE id = ?',
                [this.id]
            );
            this.is_active = false;
            return true;
        } catch (error) {
            console.error('Error en User.delete:', error);
            return false;
        }
    }

    // Convertir a JSON (omitir datos sensibles)
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            full_name: this.full_name,
            document_type: this.document_type,
            document_number: this.document_number,
            phone: this.phone,
            birth_date: this.birth_date,
            created_at: this.created_at,
            last_login: this.last_login,
            is_active: this.is_active
        };
    }
}

module.exports = User;
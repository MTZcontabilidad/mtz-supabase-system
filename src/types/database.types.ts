// =====================================================================
// 🔧 TIPOS TYPESCRIPT GENERADOS DESDE SUPABASE
// Archivo: src/types/database.types.ts
// Generado: Julio 2025
// Versión: 3.0.0
// Propósito: Tipos TypeScript para integración con Supabase
// =====================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      asignaciones_clientes: {
        Row: {
          activo: boolean | null
          asignado_por_id: string | null
          cliente_id: string | null
          fecha_asignacion: string | null
          id: number
          notas: string | null
          permisos_especiales: Json | null
          usuario_id: string | null
        }
        Insert: {
          activo?: boolean | null
          asignado_por_id?: string | null
          cliente_id?: string | null
          fecha_asignacion?: string | null
          id?: number
          notas?: string | null
          permisos_especiales?: Json | null
          usuario_id?: string | null
        }
        Update: {
          activo?: boolean | null
          asignado_por_id?: string | null
          cliente_id?: string | null
          fecha_asignacion?: string | null
          id?: number
          notas?: string | null
          permisos_especiales?: Json | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asignaciones_clientes_asignado_por_id_fkey"
            columns: ["asignado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignaciones_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_contables"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "asignaciones_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "resumen_ventas_cliente"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "asignaciones_clientes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
      asignaciones_trabajo: {
        Row: {
          asignado_por_id: string | null
          cliente_id: string | null
          descripcion: string | null
          estado: string | null
          fecha_asignacion: string | null
          fecha_vencimiento: string | null
          id: number
          tipo_trabajo: string | null
          usuario_externo_id: string | null
        }
        Insert: {
          asignado_por_id?: string | null
          cliente_id?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_asignacion?: string | null
          fecha_vencimiento?: string | null
          id?: number
          tipo_trabajo?: string | null
          usuario_externo_id?: string | null
        }
        Update: {
          asignado_por_id?: string | null
          cliente_id?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_asignacion?: string | null
          fecha_vencimiento?: string | null
          id?: number
          tipo_trabajo?: string | null
          usuario_externo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asignaciones_trabajo_asignado_por_id_fkey"
            columns: ["asignado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignaciones_trabajo_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_contables"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "asignaciones_trabajo_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "resumen_ventas_cliente"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "asignaciones_trabajo_usuario_externo_id_fkey"
            columns: ["usuario_externo_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes_contables: {
        Row: {
          categoria_cliente: string | null
          certificado_digital: string | null
          clave_sii: string | null
          clave_sii_representante: string | null
          clave_unica: string | null
          created_at: string | null
          direccion_completa: string | null
          email: string | null
          empresa_contable_id: string | null
          estado: string | null
          fecha_registro: string | null
          id: number
          id_cliente: string
          numero_facturas: number | null
          promedio_factura: number | null
          razon_social: string
          rubro: string | null
          rut: string
          rut_representante_legal: string | null
          telefono: string | null
          tipo_empresa: string | null
          total_facturado: number | null
          ultima_factura_emitida: string | null
          updated_at: string | null
          usuario_asignado: string | null
        }
        Insert: {
          categoria_cliente?: string | null
          certificado_digital?: string | null
          clave_sii?: string | null
          clave_sii_representante?: string | null
          clave_unica?: string | null
          created_at?: string | null
          direccion_completa?: string | null
          email?: string | null
          empresa_contable_id?: string | null
          estado?: string | null
          fecha_registro?: string | null
          id?: number
          id_cliente: string
          numero_facturas?: number | null
          promedio_factura?: number | null
          razon_social: string
          rubro?: string | null
          rut: string
          rut_representante_legal?: string | null
          telefono?: string | null
          tipo_empresa?: string | null
          total_facturado?: number | null
          ultima_factura_emitida?: string | null
          updated_at?: string | null
          usuario_asignado?: string | null
        }
        Update: {
          categoria_cliente?: string | null
          certificado_digital?: string | null
          clave_sii?: string | null
          clave_sii_representante?: string | null
          clave_unica?: string | null
          created_at?: string | null
          direccion_completa?: string | null
          email?: string | null
          empresa_contable_id?: string | null
          estado?: string | null
          fecha_registro?: string | null
          id?: number
          id_cliente?: string
          numero_facturas?: number | null
          promedio_factura?: number | null
          razon_social?: string
          rubro?: string | null
          rut?: string
          rut_representante_legal?: string | null
          telefono?: string | null
          tipo_empresa?: string | null
          total_facturado?: number | null
          ultima_factura_emitida?: string | null
          updated_at?: string | null
          usuario_asignado?: string | null
        }
        Relationships: []
      }
      cobranzas: {
        Row: {
          asignado_a_id: string | null
          cliente_id: string | null
          created_at: string | null
          descripcion: string | null
          estado: string | null
          fecha_pago: string | null
          fecha_vencimiento: string
          id: number
          metodo_pago: string | null
          monto_pendiente: number
          notas: string | null
          numero_factura: string | null
          prioridad: string | null
          recordatorios_enviados: number | null
          ultimo_recordatorio: string | null
          updated_at: string | null
          venta_id: number | null
        }
        Insert: {
          asignado_a_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_pago?: string | null
          fecha_vencimiento: string
          id?: number
          metodo_pago?: string | null
          monto_pendiente: number
          notas?: string | null
          numero_factura?: string | null
          prioridad?: string | null
          recordatorios_enviados?: number | null
          ultimo_recordatorio?: string | null
          updated_at?: string | null
          venta_id?: number | null
        }
        Update: {
          asignado_a_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_pago?: string | null
          fecha_vencimiento?: string
          id?: number
          metodo_pago?: string | null
          monto_pendiente?: number
          notas?: string | null
          numero_factura?: string | null
          prioridad?: string | null
          recordatorios_enviados?: number | null
          ultimo_recordatorio?: string | null
          updated_at?: string | null
          venta_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cobranzas_asignado_a_id_fkey"
            columns: ["asignado_a_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobranzas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_contables"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "cobranzas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "resumen_ventas_cliente"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "cobranzas_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["id"]
          },
        ]
      }
      compras: {
        Row: {
          comprobante_url: string | null
          created_at: string | null
          descripcion: string | null
          estado: string | null
          fecha_compra: string
          id: number
          impuesto_iva: number
          metodo_pago: string | null
          monto_total: number
          proveedor_id: number
          trabajador_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comprobante_url?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_compra?: string
          id?: never
          impuesto_iva: number
          metodo_pago?: string | null
          monto_total: number
          proveedor_id: number
          trabajador_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comprobante_url?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_compra?: string
          id?: never
          impuesto_iva?: number
          metodo_pago?: string | null
          monto_total?: number
          proveedor_id?: number
          trabajador_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_trabajador_id_fkey"
            columns: ["trabajador_id"]
            isOneToOne: false
            referencedRelation: "rendimiento_trabajadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_trabajador_id_fkey"
            columns: ["trabajador_id"]
            isOneToOne: false
            referencedRelation: "trabajadores"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          condiciones_especiales: string | null
          created_at: string | null
          estado: string | null
          fecha_fin: string | null
          fecha_inicio: string
          id: number
          salario_base: number
          tipo_contrato: string
          trabajador_id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          condiciones_especiales?: string | null
          created_at?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio: string
          id?: never
          salario_base: number
          tipo_contrato: string
          trabajador_id: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          condiciones_especiales?: string | null
          created_at?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: never
          salario_base?: number
          tipo_contrato?: string
          trabajador_id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_trabajador_id_fkey"
            columns: ["trabajador_id"]
            isOneToOne: false
            referencedRelation: "rendimiento_trabajadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_trabajador_id_fkey"
            columns: ["trabajador_id"]
            isOneToOne: false
            referencedRelation: "trabajadores"
            referencedColumns: ["id"]
          },
        ]
      }
      declaraciones_iva: {
        Row: {
          archivo_url: string | null
          created_at: string | null
          estado: string | null
          fecha_declaracion: string
          id: number
          monto_base: number
          monto_iva: number
          notas: string | null
          periodo: string
          trabajador_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archivo_url?: string | null
          created_at?: string | null
          estado?: string | null
          fecha_declaracion: string
          id?: never
          monto_base: number
          monto_iva: number
          notas?: string | null
          periodo: string
          trabajador_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archivo_url?: string | null
          created_at?: string | null
          estado?: string | null
          fecha_declaracion?: string
          id?: never
          monto_base?: number
          monto_iva?: number
          notas?: string | null
          periodo?: string
          trabajador_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "declaraciones_iva_trabajador_id_fkey"
            columns: ["trabajador_id"]
            isOneToOne: false
            referencedRelation: "rendimiento_trabajadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "declaraciones_iva_trabajador_id_fkey"
            columns: ["trabajador_id"]
            isOneToOne: false
            referencedRelation: "trabajadores"
            referencedColumns: ["id"]
          },
        ]
      }
      detalles_venta: {
        Row: {
          cantidad: number | null
          created_at: string | null
          descripcion: string
          descuento: number | null
          id: number
          precio_unitario: number
          servicio_id: number | null
          subtotal: number
          venta_id: number | null
        }
        Insert: {
          cantidad?: number | null
          created_at?: string | null
          descripcion: string
          descuento?: number | null
          id?: number
          precio_unitario: number
          servicio_id?: number | null
          subtotal: number
          venta_id?: number | null
        }
        Update: {
          cantidad?: number | null
          created_at?: string | null
          descripcion?: string
          descuento?: number | null
          id?: number
          precio_unitario?: number
          servicio_id?: number | null
          subtotal?: number
          venta_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_venta_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_venta_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas_contables: {
        Row: {
          activa: boolean | null
          configuracion: Json | null
          contador_principal: string | null
          created_at: string | null
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          rut: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          activa?: boolean | null
          configuracion?: Json | null
          contador_principal?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          rut?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          activa?: boolean | null
          configuracion?: Json | null
          contador_principal?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          rut?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      perfiles_usuario: {
        Row: {
          activo: boolean | null
          configuracion: Json | null
          created_at: string | null
          email: string | null
          empresa_contable: string | null
          id: string
          nombre_completo: string | null
          rol: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          configuracion?: Json | null
          created_at?: string | null
          email?: string | null
          empresa_contable?: string | null
          id: string
          nombre_completo?: string | null
          rol?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          configuracion?: Json | null
          created_at?: string | null
          email?: string | null
          empresa_contable?: string | null
          id?: string
          nombre_completo?: string | null
          rol?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
          permisos: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
          permisos?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
          permisos?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      servicios: {
        Row: {
          activo: boolean | null
          categoria: string
          codigo: string
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
          precio_base: number
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          categoria: string
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
          precio_base: number
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          categoria?: string
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
          precio_base?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      trabajadores: {
        Row: {
          apellido: string
          cargo: string | null
          created_at: string | null
          departamento: string | null
          email: string
          estado_empleado: string | null
          fecha_contratacion: string
          fecha_nacimiento: string | null
          id: number
          nombre: string
          salario: number
          telefono: string | null
          tipo_contrato: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          apellido: string
          cargo?: string | null
          created_at?: string | null
          departamento?: string | null
          email: string
          estado_empleado?: string | null
          fecha_contratacion: string
          fecha_nacimiento?: string | null
          id?: never
          nombre: string
          salario: number
          telefono?: string | null
          tipo_contrato?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          apellido?: string
          cargo?: string | null
          created_at?: string | null
          departamento?: string | null
          email?: string
          estado_empleado?: string | null
          fecha_contratacion?: string
          fecha_nacimiento?: string | null
          id?: never
          nombre?: string
          salario?: number
          telefono?: string | null
          tipo_contrato?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      usuarios_sistema: {
        Row: {
          activo: boolean | null
          cargo: string | null
          created_at: string | null
          email: string
          empresa_asignada: string | null
          fecha_ultimo_acceso: string | null
          id: string
          nombre_completo: string | null
          notas: string | null
          rol_id: number | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          email: string
          empresa_asignada?: string | null
          fecha_ultimo_acceso?: string | null
          id: string
          nombre_completo?: string | null
          notas?: string | null
          rol_id?: number | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          email?: string
          empresa_asignada?: string | null
          fecha_ultimo_acceso?: string | null
          id?: string
          nombre_completo?: string | null
          notas?: string | null
          rol_id?: number | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_sistema_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      ventas: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          descripcion: string | null
          emitida_por_id: string | null
          estado: string | null
          fecha_emision: string
          fecha_pago: string | null
          fecha_vencimiento: string
          id: number
          iva: number | null
          metodo_pago: string | null
          monto_neto: number
          monto_total: number
          notas: string | null
          numero_factura: string
          tipo_servicio: string
          updated_at: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          emitida_por_id?: string | null
          estado?: string | null
          fecha_emision: string
          fecha_pago?: string | null
          fecha_vencimiento: string
          id?: number
          iva?: number | null
          metodo_pago?: string | null
          monto_neto: number
          monto_total: number
          notas?: string | null
          numero_factura: string
          tipo_servicio: string
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          emitida_por_id?: string | null
          estado?: string | null
          fecha_emision?: string
          fecha_pago?: string | null
          fecha_vencimiento?: string
          id?: number
          iva?: number | null
          metodo_pago?: string | null
          monto_neto?: number
          monto_total?: number
          notas?: string | null
          numero_factura?: string
          tipo_servicio?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ventas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_contables"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "ventas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "resumen_ventas_cliente"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "ventas_emitida_por_id_fkey"
            columns: ["emitida_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      estado_cobranzas: {
        Row: {
          estado: string | null
          monto_promedio_pendiente: number | null
          monto_total_pendiente: number | null
          total_cobranzas: number | null
        }
        Relationships: []
      }
      rendimiento_trabajadores: {
        Row: {
          contratos_activos: number | null
          id: number | null
          nombre_completo: string | null
          total_ventas: number | null
          ventas_realizadas: number | null
        }
        Relationships: []
      }
      resumen_ventas_cliente: {
        Row: {
          id_cliente: string | null
          monto_total_ventas: number | null
          promedio_venta: number | null
          razon_social: string | null
          total_ventas: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_finance_team: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: { user_id: string; resource: string; action: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// =====================================================================
// 🎯 TIPOS PERSONALIZADOS PARA EL SISTEMA MTZ
// =====================================================================

// Tipos específicos para clientes
export type Cliente = Tables<'clientes_contables'>
export type ClienteInsert = TablesInsert<'clientes_contables'>
export type ClienteUpdate = TablesUpdate<'clientes_contables'>

// Tipos específicos para usuarios
export type Usuario = Tables<'usuarios_sistema'>
export type UsuarioInsert = TablesInsert<'usuarios_sistema'>
export type UsuarioUpdate = TablesUpdate<'usuarios_sistema'>

// Tipos específicos para roles
export type Rol = Tables<'roles'>
export type RolInsert = TablesInsert<'roles'>
export type RolUpdate = TablesUpdate<'roles'>

// Tipos específicos para ventas
export type Venta = Tables<'ventas'>
export type VentaInsert = TablesInsert<'ventas'>
export type VentaUpdate = TablesUpdate<'ventas'>

// Tipos específicos para cobranzas
export type Cobranza = Tables<'cobranzas'>
export type CobranzaInsert = TablesInsert<'cobranzas'>
export type CobranzaUpdate = TablesUpdate<'cobranzas'>

// Tipos específicos para servicios
export type Servicio = Tables<'servicios'>
export type ServicioInsert = TablesInsert<'servicios'>
export type ServicioUpdate = TablesUpdate<'servicios'>

// Tipos para vistas
export type ResumenVentasCliente = Tables<'resumen_ventas_cliente'>
export type EstadoCobranzas = Tables<'estado_cobranzas'>
export type RendimientoTrabajadores = Tables<'rendimiento_trabajadores'>

// =====================================================================
// 🔧 TIPOS DE UTILIDAD
// =====================================================================

// Estados válidos para diferentes entidades
export type EstadoCliente = 'Activo' | 'Inactivo' | 'Suspendido'
export type EstadoVenta = 'Emitida' | 'Pagada' | 'Vencida' | 'Anulada'
export type EstadoCobranza = 'Pendiente' | 'Pagado' | 'Vencido' | 'Cancelado'
export type CategoriaCliente = 'Top' | 'Medio' | 'Bajo' | 'VIP' | 'Premium' | 'Regular'
export type TipoEmpresa = 'SPA' | 'SA' | 'LTDA' | 'EIRL' | 'Persona Natural' | 'Fundación'

// Estructura de permisos
export interface PermisosRol {
  clientes: {
    read: boolean
    write: boolean
    delete: boolean
  }
  reportes: {
    read: boolean
    write: boolean
    delete: boolean
  }
  usuarios: {
    read: boolean
    write: boolean
    delete: boolean
  }
  asignaciones: {
    read: boolean
    write: boolean
    delete: boolean
  }
  configuracion: {
    read: boolean
    write: boolean
  }
}

// Tipos para autenticación y contexto
export interface AuthUser {
  id: string
  email: string
  nombre_completo?: string
  rol?: string
  permisos?: PermisosRol
  activo: boolean
}

// =====================================================================
// ✅ ARCHIVO DE TIPOS COMPLETADO
// Generado automáticamente desde Supabase
// Versión: 3.0.0 - Sistema MTZ Ouroborus AI
// =====================================================================

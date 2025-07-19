export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      asignaciones_trabajo: {
        Row: {
          asignado_por_id: string | null;
          cliente_id: string | null;
          descripcion: string | null;
          estado: string | null;
          fecha_asignacion: string | null;
          fecha_vencimiento: string | null;
          id: number;
          tipo_trabajo: string | null;
          usuario_externo_id: string | null;
        };
        Insert: {
          asignado_por_id?: string | null;
          cliente_id?: string | null;
          descripcion?: string | null;
          estado?: string | null;
          fecha_asignacion?: string | null;
          fecha_vencimiento?: string | null;
          id?: number;
          tipo_trabajo?: string | null;
          usuario_externo_id?: string | null;
        };
        Update: {
          asignado_por_id?: string | null;
          cliente_id?: string | null;
          descripcion?: string | null;
          estado?: string | null;
          fecha_asignacion?: string | null;
          fecha_vencimiento?: string | null;
          id?: number;
          tipo_trabajo?: string | null;
          usuario_externo_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'asignaciones_trabajo_asignado_por_id_fkey';
            columns: ['asignado_por_id'];
            isOneToOne: false;
            referencedRelation: 'usuarios_sistema';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'asignaciones_trabajo_cliente_id_fkey';
            columns: ['cliente_id'];
            isOneToOne: false;
            referencedRelation: 'clientes_contables';
            referencedColumns: ['id_cliente'];
          },
          {
            foreignKeyName: 'asignaciones_trabajo_usuario_externo_id_fkey';
            columns: ['usuario_externo_id'];
            isOneToOne: false;
            referencedRelation: 'usuarios_sistema';
            referencedColumns: ['id'];
          },
        ];
      };
      clientes_contables: {
        Row: {
          categoria_cliente: string | null;
          certificado_digital: string | null;
          clave_sii: string | null;
          clave_sii_representante: string | null;
          clave_unica: string | null;
          created_at: string | null;
          direccion_completa: string | null;
          email: string | null;
          empresa_contable_id: string | null;
          estado: string | null;
          fecha_registro: string | null;
          id: number;
          id_cliente: string;
          numero_facturas: number | null;
          promedio_factura: number | null;
          razon_social: string;
          rubro: string | null;
          rut: string;
          rut_representante_legal: string | null;
          telefono: string | null;
          tipo_empresa: string | null;
          total_facturado: number | null;
          ultima_factura_emitida: string | null;
          updated_at: string | null;
          usuario_asignado: string | null;
        };
        Insert: {
          categoria_cliente?: string | null;
          certificado_digital?: string | null;
          clave_sii?: string | null;
          clave_sii_representante?: string | null;
          clave_unica?: string | null;
          created_at?: string | null;
          direccion_completa?: string | null;
          email?: string | null;
          empresa_contable_id?: string | null;
          estado?: string | null;
          fecha_registro?: string | null;
          id?: number;
          id_cliente: string;
          numero_facturas?: number | null;
          promedio_factura?: number | null;
          razon_social: string;
          rubro?: string | null;
          rut: string;
          rut_representante_legal?: string | null;
          telefono?: string | null;
          tipo_empresa?: string | null;
          total_facturado?: number | null;
          ultima_factura_emitida?: string | null;
          updated_at?: string | null;
          usuario_asignado?: string | null;
        };
        Update: {
          categoria_cliente?: string | null;
          certificado_digital?: string | null;
          clave_sii?: string | null;
          clave_sii_representante?: string | null;
          clave_unica?: string | null;
          created_at?: string | null;
          direccion_completa?: string | null;
          email?: string | null;
          empresa_contable_id?: string | null;
          estado?: string | null;
          fecha_registro?: string | null;
          id?: number;
          id_cliente?: string;
          numero_facturas?: number | null;
          promedio_factura?: number | null;
          razon_social?: string;
          rubro?: string | null;
          rut?: string;
          rut_representante_legal?: string | null;
          telefono?: string | null;
          tipo_empresa?: string | null;
          total_facturado?: number | null;
          ultima_factura_emitida?: string | null;
          updated_at?: string | null;
          usuario_asignado?: string | null;
        };
        Relationships: [];
      };
      empresas_contables: {
        Row: {
          activa: boolean | null;
          configuracion: Json | null;
          contador_principal: string | null;
          created_at: string | null;
          direccion: string | null;
          email: string | null;
          id: string;
          nombre: string;
          rut: string | null;
          telefono: string | null;
          updated_at: string | null;
        };
        Insert: {
          activa?: boolean | null;
          configuracion?: Json | null;
          contador_principal?: string | null;
          created_at?: string | null;
          direccion?: string | null;
          email?: string | null;
          id?: string;
          nombre: string;
          rut?: string | null;
          telefono?: string | null;
          updated_at?: string | null;
        };
        Update: {
          activa?: boolean | null;
          configuracion?: Json | null;
          contador_principal?: string | null;
          created_at?: string | null;
          direccion?: string | null;
          email?: string | null;
          id?: string;
          nombre?: string;
          rut?: string | null;
          telefono?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      perfiles_usuario: {
        Row: {
          activo: boolean | null;
          configuracion: Json | null;
          created_at: string | null;
          email: string | null;
          empresa_contable: string | null;
          id: string;
          nombre_completo: string | null;
          rol: string | null;
          telefono: string | null;
          updated_at: string | null;
        };
        Insert: {
          activo?: boolean | null;
          configuracion?: Json | null;
          created_at?: string | null;
          email?: string | null;
          empresa_contable?: string | null;
          id: string;
          nombre_completo?: string | null;
          rol?: string | null;
          telefono?: string | null;
          updated_at?: string | null;
        };
        Update: {
          activo?: boolean | null;
          configuracion?: Json | null;
          created_at?: string | null;
          email?: string | null;
          empresa_contable?: string | null;
          id?: string;
          nombre_completo?: string | null;
          rol?: string | null;
          telefono?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          created_at: string | null;
          descripcion: string | null;
          id: number;
          nombre: string;
          permisos: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          descripcion?: string | null;
          id?: number;
          nombre: string;
          permisos?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          descripcion?: string | null;
          id?: number;
          nombre?: string;
          permisos?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      usuarios_sistema: {
        Row: {
          activo: boolean | null;
          cargo: string | null;
          created_at: string | null;
          email: string;
          empresa_asignada: string | null;
          fecha_ultimo_acceso: string | null;
          id: string;
          nombre_completo: string | null;
          notas: string | null;
          rol_id: number | null;
          telefono: string | null;
          updated_at: string | null;
        };
        Insert: {
          activo?: boolean | null;
          cargo?: string | null;
          created_at?: string | null;
          email: string;
          empresa_asignada?: string | null;
          fecha_ultimo_acceso?: string | null;
          id: string;
          nombre_completo?: string | null;
          notas?: string | null;
          rol_id?: number | null;
          telefono?: string | null;
          updated_at?: string | null;
        };
        Update: {
          activo?: boolean | null;
          cargo?: string | null;
          created_at?: string | null;
          email?: string;
          empresa_asignada?: string | null;
          fecha_ultimo_acceso?: string | null;
          id?: string;
          nombre_completo?: string | null;
          notas?: string | null;
          rol_id?: number | null;
          telefono?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'usuarios_sistema_rol_id_fkey';
            columns: ['rol_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: string;
      };
      user_has_permission: {
        Args: { user_id: string; resource: string; action: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// =====================================================================
// 🚀 TIPOS ADICIONALES MTZ - Extendidos para mejor UX
// =====================================================================

// Tipo para Cliente con campos calculados
export type ClienteCompleto = Tables<'clientes_contables'> & {
  facturacion_promedio?: number;
  dias_sin_facturar?: number;
  riesgo_nivel?: 'alto' | 'medio' | 'bajo';
};

// Tipo para Usuario con rol extendido
export type UsuarioCompleto = Tables<'usuarios_sistema'> & {
  rol?: Tables<'roles'>;
  permisos_efectivos?: Record<string, any>;
};

// Tipos para MFA (cuando se implementen las tablas)
export interface MFAFactor {
  id: string;
  friendly_name: string;
  factor_type: 'totp' | 'phone';
  status: 'unverified' | 'verified';
  created_at: string;
  updated_at: string;
}

export interface AALResponse {
  currentLevel: 'aal1' | 'aal2';
  nextLevel: 'aal1' | 'aal2';
  currentAuthenticationMethods: Array<{
    method: string;
    timestamp: number;
  }>;
}

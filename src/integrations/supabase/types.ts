export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: Json
          id: string
          resource_id: string | null
          resource_type: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          resource_id?: string | null
          resource_type: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          resource_id?: string | null
          resource_type?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          max_uses: number | null
          status: string
          uses: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          status?: string
          uses?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          status?: string
          uses?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      course_certificates: {
        Row: {
          certificate_number: string
          course_id: string
          enrollment_id: string
          id: string
          issued_at: string
          user_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          enrollment_id: string
          id?: string
          issued_at?: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          enrollment_id?: string
          id?: string
          issued_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress_percent: number
          source: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress_percent?: number
          source?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress_percent?: number
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lesson_progress: {
        Row: {
          completed_at: string | null
          enrollment_id: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
          watch_seconds: number
        }
        Insert: {
          completed_at?: string | null
          enrollment_id: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
          watch_seconds?: number
        }
        Update: {
          completed_at?: string | null
          enrollment_id?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
          watch_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          end_seconds: number | null
          id: string
          is_preview: boolean
          notes: string | null
          position: number
          start_seconds: number
          title: string
          updated_at: string
          video_id: string | null
          video_source: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          end_seconds?: number | null
          id?: string
          is_preview?: boolean
          notes?: string | null
          position?: number
          start_seconds?: number
          title: string
          updated_at?: string
          video_id?: string | null
          video_source?: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          end_seconds?: number | null
          id?: string
          is_preview?: boolean
          notes?: string | null
          position?: number
          start_seconds?: number
          title?: string
          updated_at?: string
          video_id?: string | null
          video_source?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quiz_attempts: {
        Row: {
          answers: Json
          created_at: string
          enrollment_id: string
          id: string
          passed: boolean
          quiz_id: string
          score_percent: number
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          enrollment_id: string
          id?: string
          passed?: boolean
          quiz_id: string
          score_percent?: number
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          enrollment_id?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score_percent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_quiz_attempts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "course_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quiz_questions: {
        Row: {
          correct_index: number
          created_at: string
          id: string
          options: Json
          position: number
          question: string
          quiz_id: string
        }
        Insert: {
          correct_index?: number
          created_at?: string
          id?: string
          options?: Json
          position?: number
          question: string
          quiz_id: string
        }
        Update: {
          correct_index?: number
          created_at?: string
          id?: string
          options?: Json
          position?: number
          question?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "course_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quizzes: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          lesson_id: string | null
          pass_percent: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          pass_percent?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          pass_percent?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          block_youtube_links: boolean
          category: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          instructor_name: string | null
          is_free: boolean
          is_published: boolean
          level: string | null
          min_quiz_percent: number
          min_watch_percent: number
          player_accent_color: string
          price_inr: number
          signatory_name: string | null
          signatory_title: string | null
          signature_image: string | null
          slug: string
          sort_order: number
          summary: string | null
          title: string
          updated_at: string
          youtube_privacy_mode: boolean
        }
        Insert: {
          block_youtube_links?: boolean
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructor_name?: string | null
          is_free?: boolean
          is_published?: boolean
          level?: string | null
          min_quiz_percent?: number
          min_watch_percent?: number
          player_accent_color?: string
          price_inr?: number
          signatory_name?: string | null
          signatory_title?: string | null
          signature_image?: string | null
          slug: string
          sort_order?: number
          summary?: string | null
          title: string
          updated_at?: string
          youtube_privacy_mode?: boolean
        }
        Update: {
          block_youtube_links?: boolean
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructor_name?: string | null
          is_free?: boolean
          is_published?: boolean
          level?: string | null
          min_quiz_percent?: number
          min_watch_percent?: number
          player_accent_color?: string
          price_inr?: number
          signatory_name?: string | null
          signatory_title?: string | null
          signature_image?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          title?: string
          updated_at?: string
          youtube_privacy_mode?: boolean
        }
        Relationships: []
      }
      membership_tiers: {
        Row: {
          color: string
          created_at: string
          description: string | null
          duration_days: number | null
          features: Json
          gradient_from: string
          gradient_to: string
          id: string
          is_active: boolean
          name: string
          price_inr: number
          rank: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          duration_days?: number | null
          features?: Json
          gradient_from?: string
          gradient_to?: string
          id?: string
          is_active?: boolean
          name: string
          price_inr?: number
          rank?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          duration_days?: number | null
          features?: Json
          gradient_from?: string
          gradient_to?: string
          id?: string
          is_active?: boolean
          name?: string
          price_inr?: number
          rank?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      module_records: {
        Row: {
          amount_inr: number | null
          created_at: string
          customer_id: string | null
          due_at: string | null
          id: string
          metadata: Json
          module: string
          owner_id: string | null
          status: string
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          amount_inr?: number | null
          created_at?: string
          customer_id?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json
          module: string
          owner_id?: string | null
          status?: string
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          amount_inr?: number | null
          created_at?: string
          customer_id?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json
          module?: string
          owner_id?: string | null
          status?: string
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          audience: string
          body: string | null
          created_at: string
          email_status: string
          href: string | null
          id: string
          kind: string
          metadata: Json
          read_at: string | null
          sms_status: string
          title: string
          updated_at: string
          user_id: string | null
          whatsapp_status: string
        }
        Insert: {
          audience?: string
          body?: string | null
          created_at?: string
          email_status?: string
          href?: string | null
          id?: string
          kind?: string
          metadata?: Json
          read_at?: string | null
          sms_status?: string
          title: string
          updated_at?: string
          user_id?: string | null
          whatsapp_status?: string
        }
        Update: {
          audience?: string
          body?: string | null
          created_at?: string
          email_status?: string
          href?: string | null
          id?: string
          kind?: string
          metadata?: Json
          read_at?: string | null
          sms_status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          whatsapp_status?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_inr: number
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_cycle: string | null
          billing_postal_code: string | null
          billing_state: string | null
          coupon_code: string | null
          created_at: string
          customer_email: string | null
          customer_gstin: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          gst_inr: number
          gst_percent: number
          id: string
          invoice_number: string | null
          notes: string | null
          order_number: string
          paid_at: string | null
          payment_id: string | null
          payment_method: string | null
          product_id: string | null
          product_name: string
          quantity: number
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          total_inr: number
          updated_at: string
          wallet_applied_inr: number
        }
        Insert: {
          amount_inr?: number
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_cycle?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_gstin?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          gst_inr?: number
          gst_percent?: number
          id?: string
          invoice_number?: string | null
          notes?: string | null
          order_number?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          total_inr?: number
          updated_at?: string
          wallet_applied_inr?: number
        }
        Update: {
          amount_inr?: number
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_cycle?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_gstin?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          gst_inr?: number
          gst_percent?: number
          id?: string
          invoice_number?: string | null
          notes?: string | null
          order_number?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          total_inr?: number
          updated_at?: string
          wallet_applied_inr?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_inr: number
          created_at: string
          gateway_reference: string | null
          id: string
          method: string
          order_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount_inr: number
          created_at?: string
          gateway_reference?: string | null
          id?: string
          method?: string
          order_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount_inr?: number
          created_at?: string
          gateway_reference?: string | null
          id?: string
          method?: string
          order_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_otps: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          verified?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          billing: string
          category_id: string | null
          created_at: string
          demo_enabled: boolean
          demo_url: string | null
          description: string | null
          featured: boolean
          features: Json
          gallery_urls: Json
          gst_percent: number
          id: string
          long_description: string | null
          name: string
          popular: boolean
          price_inr: number
          product_type: string
          sku: string | null
          slug: string
          status: string
          stock: number | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          billing?: string
          category_id?: string | null
          created_at?: string
          demo_enabled?: boolean
          demo_url?: string | null
          description?: string | null
          featured?: boolean
          features?: Json
          gallery_urls?: Json
          gst_percent?: number
          id?: string
          long_description?: string | null
          name: string
          popular?: boolean
          price_inr?: number
          product_type?: string
          sku?: string | null
          slug: string
          status?: string
          stock?: number | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          billing?: string
          category_id?: string | null
          created_at?: string
          demo_enabled?: boolean
          demo_url?: string | null
          description?: string | null
          featured?: boolean
          features?: Json
          gallery_urls?: Json
          gst_percent?: number
          id?: string
          long_description?: string | null
          name?: string
          popular?: boolean
          price_inr?: number
          product_type?: string
          sku?: string | null
          slug?: string
          status?: string
          stock?: number | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          avatar_url: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          gstin: string | null
          id: string
          location: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string
          two_fa_enabled: boolean
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gstin?: string | null
          id: string
          location?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string
          two_fa_enabled?: boolean
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gstin?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string
          two_fa_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      resource_access: {
        Row: {
          created_at: string
          id: string
          min_tier_rank: number
          notes: string | null
          required_tier_ids: Json
          resource_id: string | null
          resource_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_tier_rank?: number
          notes?: string | null
          required_tier_ids?: Json
          resource_id?: string | null
          resource_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_tier_rank?: number
          notes?: string | null
          required_tier_ids?: Json
          resource_id?: string | null
          resource_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount_inr: number
          billing_cycle: string
          cancel_at: string | null
          created_at: string
          current_period_end: string | null
          customer_id: string
          id: string
          plan: string
          product_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_inr?: number
          billing_cycle?: string
          cancel_at?: string | null
          created_at?: string
          current_period_end?: string | null
          customer_id: string
          id?: string
          plan: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_inr?: number
          billing_cycle?: string
          cancel_at?: string | null
          created_at?: string
          current_period_end?: string | null
          customer_id?: string
          id?: string
          plan?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_departments: {
        Row: {
          active: boolean
          created_at: string
          default_assignee: string | null
          description: string | null
          email: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          default_assignee?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          default_assignee?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      ticket_priorities: {
        Row: {
          active: boolean
          color: string
          created_at: string
          id: string
          name: string
          sla_resolve_mins: number
          sla_response_mins: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          id?: string
          name: string
          sla_resolve_mins?: number
          sla_response_mins?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          id?: string
          name?: string
          sla_resolve_mins?: number
          sla_response_mins?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      ticket_replies: {
        Row: {
          author_id: string | null
          author_name: string | null
          created_at: string
          id: string
          is_staff: boolean
          message: string
          ticket_id: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          is_staff?: boolean
          message: string
          ticket_id: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          is_staff?: boolean
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_routing_rules: {
        Row: {
          active: boolean
          assign_to: string | null
          created_at: string
          id: string
          match_department: string | null
          match_keyword: string | null
          match_priority: string | null
          name: string
          set_priority: string | null
          set_status: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          assign_to?: string | null
          created_at?: string
          id?: string
          match_department?: string | null
          match_keyword?: string | null
          match_priority?: string | null
          name: string
          set_priority?: string | null
          set_status?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          assign_to?: string | null
          created_at?: string
          id?: string
          match_department?: string | null
          match_keyword?: string | null
          match_priority?: string | null
          name?: string
          set_priority?: string | null
          set_status?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string | null
          department: string
          description: string | null
          first_response_at: string | null
          id: string
          priority: string
          resolved_at: string | null
          sla_due_at: string | null
          status: string
          subject: string
          tags: string[]
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          department?: string
          description?: string | null
          first_response_at?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subject: string
          tags?: string[]
          ticket_number?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          department?: string
          description?: string | null
          first_response_at?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subject?: string
          tags?: string[]
          ticket_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          auto_renew: boolean
          created_at: string
          expires_at: string | null
          id: string
          notes: string | null
          source: string
          starts_at: string
          status: string
          tier_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          source?: string
          starts_at?: string
          status?: string
          tier_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          source?: string
          starts_at?: string
          status?: string
          tier_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount_inr: number
          balance_after_inr: number | null
          created_at: string
          description: string | null
          id: string
          note: string | null
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string | null
          wallet_id: string
        }
        Insert: {
          amount_inr: number
          balance_after_inr?: number | null
          created_at?: string
          description?: string | null
          id?: string
          note?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id?: string | null
          wallet_id: string
        }
        Update: {
          amount_inr?: number
          balance_after_inr?: number | null
          created_at?: string
          description?: string | null
          id?: string
          note?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_inr: number
          created_at: string
          frozen: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_inr?: number
          created_at?: string
          frozen?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_inr?: number
          created_at?: string
          frozen?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tier_rank: { Args: { _user_id: string }; Returns: number }
      has_min_tier: {
        Args: { _min_rank: number; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      verify_certificate: {
        Args: { _certificate_number: string }
        Returns: {
          course_id: string
          issued_at: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "sales_manager"
        | "support"
        | "finance"
        | "reseller"
        | "customer"
        | "affiliate"
        | "employee"
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
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "sales_manager",
        "support",
        "finance",
        "reseller",
        "customer",
        "affiliate",
        "employee",
      ],
    },
  },
} as const

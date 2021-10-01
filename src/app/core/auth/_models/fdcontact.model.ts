
export namespace FDContact {

    export interface OtherCompany {
        company_id: number;
        view_all_tickets: boolean;
    }

    export interface CustomFields {
        department: string;
        fb_profile?: any;
        permanent: boolean;
    }

    export interface Avatar {
        avatar_url: string;
        content_type: string;
        id: number;
        name: string;
        size: number;
        created_at: Date;
        updated_at: Date;
    }

    export interface Contact {
        active: boolean;
        address?: any;
        company_id: number;
        view_all_tickets: boolean;
        description?: any;
        email: string;
        id: number;
        job_title?: any;
        language: string;
        mobile?: any;
        name: string;
        phone?: any;
        time_zone: string;
        twitter_id?: any;
        other_emails: any[];
        other_companies: OtherCompany[];
        created_at: Date;
        updated_at: Date;
        custom_fields: CustomFields;
        tags: any[];
        avatar: Avatar;
    }

}


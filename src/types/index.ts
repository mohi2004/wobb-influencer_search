export type Platform = "instagram" | "youtube" | "tiktok";

export interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  custom_name?: string;
  avg_views?: number;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface PostStat {
  likes?: number;
  comments?: number;
  views?: number;
  shares?: number;
  saves?: number;
}

export interface RecentPost {
  user_id: string;
  username: string;
  type: string;
  post_id: string;
  created: string;
  text?: string;
  video?: string;
  thumbnail?: string;
  link?: string;
  stat?: PostStat;
}

export interface SimilarUser {
  user_id: string;
  username: string;
  picture: string;
  followers: number;
  fullname: string;
  url: string;
  is_verified: boolean;
  engagements?: number;
}

export interface RelevantTag {
  tag: string;
  distance: number;
  freq: number;
}

export interface GeoLocation {
  country?: {
    name: string;
    code: string;
  };
}

export interface Contact {
  type: string;
  value: string;
  formatted_value: string;
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
  
  // New rich data fields
  avg_shares?: number;
  avg_saves?: number;
  total_likes?: number;
  recent_posts?: RecentPost[];
  similar_users?: SimilarUser[];
  relevant_tags?: RelevantTag[];
  geo?: GeoLocation;
  contacts?: Contact[];
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}

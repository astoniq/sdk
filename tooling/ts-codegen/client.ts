export interface User {
  id: string;
  photo?: UserPhoto;
}
export interface UserPhoto {
  url: string;
  width: number | null;
  height: number | null;
}

export type PostComment = PostCommentText | PostCommentImage | PostCommentVideo;
export interface PostCommentText {
  commentType: "TEXT";
  userId: string;
  user: User;
  text: string;
}

export interface PostCommentImage {
  commentType: "IMAGE";
  userId: string;
  user: User;
  imageUrl: string;
}

export interface PostCommentVideo {
  commentType: "VIDEO";
  userId: string;
  user: User;
  videoUrl: string;
}

export interface Post {
  id: string;
  isFeatured: boolean;
  userId: string;
  user: User;
  type: PostType;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  numComments: number;
  numLikes: number;
  unknownField: any;
  comments: PostComment[];
  numArray: number[];
  stringArray: string[];
  metadata: Record<string, PostMetadataValue>;
  rec: PostRec;
  tags?: string[];
}
export type PostType = "text" | "image" | "video";
export interface PostMetadataValue {
  key: string;
  createdAt: Date;
}

export interface PostRec {
  left: BinaryTree | null;
  right: BinaryTree | null;
}

export interface BinaryTree {
  left: BinaryTree | null;
  right: BinaryTree | null;
}

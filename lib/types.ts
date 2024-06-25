export enum FileType {
    ED = 'ed',
    NOTE = 'note',
    LT = 'lt',
    README = 'readme',
  }
  
export interface File {
    type: 'file';
    extension: FileType;
}
  
export interface Folder {
    type: 'folder';
    children: FileSystem;
    isOpen?: boolean;
}
  
export type FileSystemItem = File | Folder;

export interface FileSystem {
[key: string]: FileSystemItem;
}

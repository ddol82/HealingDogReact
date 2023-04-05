export interface BoardFull {
    boardCode: number,
    boardCategoryName: string,
    title: string,
    content: string,
    profileUrl?: string,
    profileName: string,
    uptime: string,
    uptimestamp: string,
    view: number,
    share?: number,
    like: number,
    originalImageUrl?: string[],
    thumbnailImageUrl: string,
    previewImageUrl?: string[],
    imageCount: number,
    commentCount: number
}
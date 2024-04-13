
// ------------------------------------------枚举------------------------------------------------------------------------

export enum TargetType {
    User = 1,
    File = 2,
    Post = 3
}

export enum RelationType {
    Like  = 1,
    Follow = 2,
    Collect = 3,
    Share = 4,
    Comment = 5,
    View = 6,
    Hate = 7,
    Upload = 8,
    Download = 9,
    Publish = 10
}

export enum CategoryType {
    UserCategory = 1,
    FileCategory = 2,
    PostCategory = 3
}

export enum FileSortType {
    CreateTimeDesc = 1,
    CreateTimeAsc = 2,
    UpdateTimeDesc = 3,
    UpdateTimeAsc = 4,
    FileNameDesc = 5,
    FileNameAsc = 6,
    FileTypeDesc = 7,
    FileTypeAsc = 8
}

export enum NotificationType {
    Like = 1,
    Follow = 2,
    Collect = 3,
    Share = 4,
    Comment = 5
}

export enum PostStatusType {
    None = 0,
    Public = 1,
    Private = 2,
    Draft = 3
}

export enum SearchSortType {
    Score = 1,
    CreateTime = 2,
    Synthesis = 3
}

export enum SearchPeriodType {
    None = 0,
    Day = 1,
    Week = 2,
    Month = 3,
    Year = 4,
}


// -----------------------------------------URL-------------------------------------------------------------------------

export const DeleteRelationUrl = "/relation/deleteRelation"
export const CreateRelationUrl = "/relation/createRelation"
export const GetRelationPathsUrl = "/relation/getRelationPaths"
export const GetFromRelationsUrl = "/relation/getFromRelations"
export const GetToRelationsUrl = "/relation/getToRelations"

export const GetHotRanksUrl = "/rank/getHotRanks"

export const GetUserUrl = "/content/getUser"
export const GetPostUrl = "/content/getPost"
export const GetPostsUrl = "/content/getPosts"
export const GetUsersUrl = "/content/searchUser"
export const MoveFileUrl = "/content/moveFile"
export const CreateFileUrl = "/content/createFile"
export const DeleteFileUrl = "/content/deleteFile"
export const DeletePostUrl = "/content/deletePost"
export const CreatePostUrl = "/content/createPost"
export const UpdateUserUrl = "/content/updateUser"
export const UpdatePostUrl = "/content/updatePost"
export const GetUserDetailUrl = "/content/getUserDetail"
export const GetPrivateFilesUrl = "/content/getPrivateFiles"
export const AskDownloadFileUrl = "/content/askDownloadFile"
export const EmptyRecycleBinUrl = "/content/emptyRecycleBin"
export const GetRecycleBinFilesUrl = "/content/getRecycleBinFiles"
export const GetLatestRecommendUrl = "/content/getLatestRecommend"
export const GetRecommendByUserUrl  = "/content/getRecommendByUser"
export const GetRecommendByItemUrl = "/content/getRecommendByItem"
export const GetPopularRecommendUrl = "/content/getPopularRecommend"
export const CompletelyRemoveFileUrl = "/content/completelyRemoveFile"
export const RecoverRecycleBinFileUrl = "/content/recoverRecycleBinFile"
export const UpdateFileUrl = "/content/updateFile"
export const AskUploadFileUrl = "/content/askUploadFile"

export const GetTagListUrl = "/label/getLabels"

export const QQLoginUrl = "/auth/qqLogin"
export const RegisterUrl = "/auth/register"
export const SendEmailUrl = "/auth/sendEmail"
export const CheckEmailUrl= "/auth/checkEmail"
export const EmailLoginUrl = "/auth/emailLogin"
export const WechatLoginUrl = "/auth/weixinLogin"
export const RefreshTokenUrl = "/auth/refreshToken"
export const WechatIsLoginUrl = "/auth/weixinIsLogin"

export const GetNotificationsUrl= "/system/getNotifications"
export const GetNotificationCountUrl = "/system/getNotificationCount"
export const GetSlidersUrl = "/system/getSliders"


export const GetCommentsUrl = "/comment/getComments"
export const CreateCommentUrl = "/comment/createComment"
export const GetCommentBlocksUrl = "/comment/getCommentBlocks"
export const DeleteCommentUrl = "/comment/deleteComment"
// ----------------------------------------Storage----------------------------------------------------------------------

export const StorageDoGetUser = "DoGetUser" // 是否获取过用户信息
export const StorageAvatarUrl= "AvatarUrl" // 头像URL
export const StorageName= "Name" // 用户名
export const StoragePostContent = "PostContent"
export const StoragePostId = "PostId"
export const StoragePostTitle = "PostTitle"
export const StorageUserId = "UserId"
export const StorageLongToken = "LongToken"
export const StoragePostUrl = "PostUrl"
export const StorageAutoLogin = "AutoLogin"
export const StorageShortToken = "ShortToken"
export const StoragePathId= "PathId"
export const StoragePathName = "PathName"
export const StoragePath = "Path"

// ---------------------------------------------------------------------------------------------------------------------

export const UserAvatarUrl = "https://cloudmind.top/users/"

// ---------------------------------------------------------------------------------------------------------------------


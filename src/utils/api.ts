// 取消关注用户
import type {Relation} from "@/utils/type";
import {post} from "@/utils/request";
import {CreateRelationUrl, DeleteRelationUrl} from "@/utils/consts";

export const DeleteRelation = (relation: Relation) =>  {
    return new Promise<void>((resolve, reject) => {
        post(true, DeleteRelationUrl, {
            toId: relation.toId,
            toType: relation.toType,
            relationType: relation.relationType,
        })
        .then(() => {
            resolve()
        })
        .catch(error => {
            reject(error)
        })
    })
}

export const CreateRelation = async(relation: Relation)=>  {
    return new Promise<void>((resolve, reject) => {
        post(true, CreateRelationUrl, {
            toId: relation.toId,
            toType: relation.toType,
            relationType: relation.relationType,
        })
        .then(() => {
           resolve()
        })
        .catch(error => {
            reject(error)
        })
    })
}


// // 关注用户
// export const CreateRelationImpl = (toId: string, toType: TargetType, relationType: RelationType, relationExist: boolean, RelationCount?: number) => {
//     const relation :Relation =  {
//         fromId: "",
//         fromType: TargetType.User,
//         toId: toId,
//         toType: toType,
//         relationType: relationType,
//     }
//     CreateRelationInterface(relation)
//         .then(() => {
//             relationExist = true
//             if (RelationCount) {
//                 RelationCount ++
//             }
//         })
//         .catch(error => {
//             errorMsg(error)
//         })
// }
//
// // 取消关注用户
// export const DeleteRelationImpl = (toId: string, toType: TargetType, relationType: RelationType, relationExist: boolean, RelationCount?: number) => {
//     const relation :Relation =  {
//         fromId: "",
//         fromType: TargetType.User,
//         toId: toId,
//         toType: toType,
//         relationType: relationType,
//     }
//     DeleteRelationInterface(relation)
//         .then(() => {
//             relationExist = false
//             if (RelationCount) {
//                 RelationCount --
//             }
//         })
//         .catch(error => {
//             errorMsg(error)
//         })
// }
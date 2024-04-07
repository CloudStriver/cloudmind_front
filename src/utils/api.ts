// 取消关注用户
import type {Relation} from "@/utils/type";
import {get, post} from "@/utils/request";
import {CreateRelationUrl, DeleteRelationUrl, GetFromRelationsUrl, GetToRelationsUrl} from "@/utils/consts";

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

export const GetFromRelation = async(relation: Relation): Promise<any> => {
   return  await get(true, `${GetFromRelationsUrl}?fromId=${relation.fromId}&fromType=${relation.fromType}&toType=${relation.toType}&relationType=${relation.relationType}`)
}

export const GetToRelation = async(relation: Relation) :Promise<any> => {
    return await get(true, `${GetToRelationsUrl}?toId=${relation.toId}&toType=${relation.toType}&fromType=${relation.fromType}&relationType=${relation.relationType}`)
}



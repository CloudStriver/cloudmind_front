import {
     RelationType,
     TargetType
} from "@/utils/consts";

export type Relation = {
    toId: string,
    toType: TargetType,
    relationType: RelationType,
}
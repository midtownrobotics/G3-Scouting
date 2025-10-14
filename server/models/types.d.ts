import { InferAttributes, Optional } from "sequelize";
import { NextMatch } from "@shared/schemas/data";
import { Permission } from "@shared/permissions";
import UserBlockAssignmentModel from "./scheduling/UserBlockAssignmentModel";

export interface User {
    id: number;
    slackId?: string | null;
    username: string;
    password: string;
    permission: Permission;
    redAlliance: boolean;
    nextMatch?: NextMatch | null;
    lastMatchScouted?: number;
    assignedMatches: number[];
    reliable: boolean;
    tokens: number;
    displayName: string | null;
    schedule?: InferAttributes<UserBlockAssignmentModel>[]
}

export interface UserCreationAttributes extends Optional<User, 'id'> { }
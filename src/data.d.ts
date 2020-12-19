import {ReactNode} from "react";

export interface PageParams {
  page: number;
  size: number;
}

export interface Entity {
  id: string;
  createTime: number;
  updateTime: number;
}

export interface NameEntity extends Entity {
  name: string
}

export interface Permission extends NameEntity{
  key: string;
  path: string;
  method: string;
  icon: string | undefined | ReactNode;
  menu: boolean;
  parent: string;
  order: number;
  children: Permission[];
}

export interface Admin extends NameEntity{
  avatar: string;
  attach: object;
  superAdmin: boolean;
}

export interface Group extends NameEntity {

}

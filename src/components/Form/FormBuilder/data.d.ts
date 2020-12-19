import {FormItemData} from "@/components/Form/FormBuilder/index";
import {Entity} from "@/data";
import {DrawerProps} from "antd/lib/drawer";
import {ColProps} from "antd/lib/grid";

export interface EditDrawerField extends FormItemData {
  filter?: (dataSource: Entity) => boolean;
}

export interface EditDrawerProps extends DrawerProps{
  bodyLoading: boolean;
  dataSource: Entity;
  renderTitle?: (prefix: string) => string;
  labelCol?: ColProps;
  fields: EditDrawerField[];
  editPrefix?: string;
  addPrefix?: string;

  onSubmit: (dataSource: Entity) => Promise;
  onSuccess: () => void;
}

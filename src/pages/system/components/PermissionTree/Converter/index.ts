import {Permission} from "@/data";

const PermissionTreeConverter = (permissions: Permission[]) => {
  const map = {};

  permissions.forEach(item => {
    map[item.path] = item;
  });

  permissions
    .filter(item => item.parent !== null)
    .forEach(item => {
      const par = map[item.parent];
      if (par) {
        par.children = [...(par.children || []),item]
      }
    })

  const list = permissions.filter(item => item.parent === null);

  list.sort((a,b) => a.order - b.order);
  list.forEach(item => (item.children || []).sort((a,b) => a.order - b.order))

  return list;
}

export default PermissionTreeConverter;

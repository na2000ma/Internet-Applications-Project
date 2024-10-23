export interface Crumb {
  id: number,
  name: string
  type: "organization" | "folder" | "group";
}

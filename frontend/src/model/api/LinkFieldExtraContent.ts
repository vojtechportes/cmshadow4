export interface LinkFieldExtraContent {
  format: "tel" | "mailto" | "default"
  target: "self" | "blank" | "parent" | "top"
  rel: string
}
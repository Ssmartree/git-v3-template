export function getImgUrl(name: string) {
  return new URL(`../assets/images/${name}`, import.meta.url).href
}

export const moduleId = new URLSearchParams(window.location.search).get('moduleId')

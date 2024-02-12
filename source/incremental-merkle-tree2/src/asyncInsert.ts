import checkParameter from "./checkParameter"
import { AsyncHashFunction, Node } from "./types"

export default async function asyncInsert(
  leaf: Node,
  depth: number,
  arity: number,
  nodes: Node[][],
  zeroes: Node[],
  hash: AsyncHashFunction
): Promise<Node> {
  checkParameter(leaf, "leaf", "number", "string", "bigint")

  if (nodes[0].length >= arity ** depth) {
    throw new Error("The tree is full")
  }

  let node = leaf
  let index = nodes[0].length

  for (let level = 0; level < depth; level += 1) {
    const position = index % arity
    const levelStartIndex = index - position
    const levelEndIndex = levelStartIndex + arity

    const children = []
    nodes[level][index] = node

    for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
      if (i < nodes[level].length) {
        children.push(nodes[level][i])
      } else {
        children.push(zeroes[level])
      }
    }

    node = await hash(children)
    index = Math.floor(index / arity)
  }

  return node
}

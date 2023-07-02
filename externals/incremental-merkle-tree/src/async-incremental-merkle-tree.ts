import checkParameter from "./checkParameter"
import _createProof from "./createProof"
import _indexOf from "./indexOf"
import _asyncInsert from "./asyncInsert"
import { AsyncHashFunction, MerkleProof, Node } from "./types"
import _asyncUpdate from "./asyncUpdate"
import _asyncVerifyProof from "./asyncVerifyProof"

/**
 * A Merkle tree is a tree in which every leaf node is labelled with the cryptographic hash of a
 * data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.
 * It allows efficient and secure verification of the contents of large data structures.
 * The IncrementalMerkleTree class is a TypeScript implementation of Incremental Merkle tree and it
 * provides all the functions to create efficient trees and to generate and verify proofs of membership.
 */
export default class AsyncIncrementalMerkleTree {
  static readonly maxDepth = 32

  private readonly _nodes: Node[][]
  private readonly _zeroes: Node[]
  private readonly _hash: AsyncHashFunction
  private readonly _depth: number
  private readonly _arity: number

  constructor(
    hash: AsyncHashFunction,
    depth: number,
    // zeroValue: Node,
    zeroes: Node[],
    arity: number,
    // leaves: Node[] = [],
    nodes: Node[][],
  ) {
    this._hash = hash
    this._depth = depth
    this._zeroes = zeroes
    this._nodes = nodes
    this._arity = arity
  }

  /**
   * Initializes the tree with the hash function, the depth, the zero value to use for zeroes
   * and the arity (i.e. the number of children for each node).
   * @param hash Hash function.
   * @param depth Tree depth.
   * @param zeroValue Zero values for zeroes.
   * @param arity The number of children for each node.
   * @param leaves The list of initial leaves.
   */
  public static async newInstance(hash: AsyncHashFunction, depth: number, zeroValue: Node, arity = 2, leaves: Node[] = []): Promise<AsyncIncrementalMerkleTree> {
    checkParameter(hash, "hash", "function")
    checkParameter(depth, "depth", "number")
    checkParameter(zeroValue, "zeroValue", "number", "string", "bigint")
    checkParameter(arity, "arity", "number")
    checkParameter(leaves, "leaves", "object")

    if (depth < 1 || depth > AsyncIncrementalMerkleTree.maxDepth) {
      throw new Error("The tree depth must be between 1 and 32")
    }

    if (leaves.length > arity ** depth) {
      throw new Error(`The tree cannot contain more than ${arity ** depth} leaves`)
    }

    // Initialize the attributes.
    const _hash = hash
    const _depth = depth
    const _zeroes = []
    const _nodes: any = []
    const _arity = arity

    for (let level = 0; level < depth; level += 1) {
      _zeroes.push(zeroValue)
      _nodes[level] = []
      // There must be a zero value for each tree level (except the root).
      zeroValue = await hash(Array(_arity).fill(zeroValue))
    }

    _nodes[depth] = []

    // It initializes the tree with a list of leaves if there are any.
    if (leaves.length > 0) {
      _nodes[0] = leaves

      for (let level = 0; level < depth; level += 1) {
        for (let index = 0; index < Math.ceil(_nodes[level].length / arity); index += 1) {
          const position = index * arity
          const children = []

          for (let i = 0; i < arity; i += 1) {
            children.push(_nodes[level][position + i] ?? _zeroes[level])
          }

          _nodes[level + 1][index] = hash(children)
        }
      }
    } else {
      // If there are no leaves, the default root is the last zero value.
      _nodes[depth][0] = zeroValue
    }

    // Freeze the array objects. It prevents unintentional changes.
    Object.freeze(_zeroes)
    Object.freeze(_nodes)

    return new AsyncIncrementalMerkleTree(_hash, _depth, _zeroes, _arity, _nodes)
  }

  /**
   * Returns the root hash of the tree.
   * @returns Root hash.
   */
  public get root(): Node {
    return this._nodes[this.depth][0]
  }

  /**
   * Returns the depth of the tree.
   * @returns Tree depth.
   */
  public get depth(): number {
    return this._depth
  }

  /**
   * Returns the leaves of the tree.
   * @returns List of leaves.
   */
  public get leaves(): Node[] {
    return this._nodes[0].slice()
  }

  /**
   * Returns the zeroes nodes of the tree.
   * @returns List of zeroes.
   */
  public get zeroes(): Node[] {
    return this._zeroes
  }

  /**
   * Returns the number of children for each node.
   * @returns Number of children per node.
   */
  public get arity(): number {
    return this._arity
  }

  /**
   * Returns the index of a leaf. If the leaf does not exist it returns -1.
   * @param leaf Tree leaf.
   * @returns Index of the leaf.
   */
  public indexOf(leaf: Node): number {
    return _indexOf(leaf, this._nodes)
  }

  /**
   * Inserts a new leaf in the tree.
   * @param leaf New leaf.
   */
  public async insert(leaf: Node): Promise<Node> {
    let node = await _asyncInsert(leaf, this.depth, this.arity, this._nodes, this.zeroes, this._hash);
    this._nodes[this.depth][0] = node;
    return node;
  }

  /**
   * Deletes a leaf from the tree. It does not remove the leaf from
   * the data structure. It set the leaf to be deleted to a zero value.
   * @param index Index of the leaf to be deleted.
   */
  public async delete(index: number) {
    this._nodes[this.depth][0] = await _asyncUpdate(
      index,
      this.zeroes[0],
      this.depth,
      this.arity,
      this._nodes,
      this.zeroes,
      this._hash
    )
  }

  /**
   * Updates a leaf in the tree.
   * @param index Index of the leaf to be updated.
   * @param newLeaf New leaf value.
   */
  public async update(index: number, newLeaf: Node): Promise<Node> {
    let node = await _asyncUpdate(
      index,
      newLeaf,
      this.depth,
      this.arity,
      this._nodes,
      this.zeroes,
      this._hash
    )
    this._nodes[this.depth][0] = node;
    return node;
  }

  /**
   * Creates a proof of membership.
   * @param index Index of the proof's leaf.
   * @returns Proof object.
   */
  public createProof(index: number): MerkleProof {
    return _createProof(index, this.depth, this.arity, this._nodes, this.zeroes, this.root)
  }

  /**
   * Verifies a proof and return true or false.
   * @param proof Proof to be verified.
   * @returns True or false.
   */
  public async verifyProof(proof: MerkleProof): Promise<boolean> {
    return _asyncVerifyProof(proof, this._hash)
  }
}

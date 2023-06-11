import { ALL_DEPTH_SIZE_PAIRS } from "@solana/spl-account-compression"

const allDepthSizes = ALL_DEPTH_SIZE_PAIRS.flatMap((pair) => pair.maxDepth).filter(
  (item, pos, self) => self.indexOf(item) == pos
)

const defaultDepthPair = {
  maxDepth: 3,
  maxBufferSize: 8,
}

export const getTreeOptions = (treeNodes: number) => {
  let maxDepth = defaultDepthPair.maxDepth

  if (treeNodes <= 0)
    return {
      maxDepth,
      maxBufferSize: defaultDepthPair.maxBufferSize,
      canopyDepth: 0,
    }

  /**
   * The only valid depthSizePairs are stored in the on-chain program and SDK
   */
  for (let i = 0; i <= allDepthSizes.length; i++) {
    if (Math.pow(2, allDepthSizes[i]) >= treeNodes) {
      maxDepth = allDepthSizes[i]
      break
    }
  }

  // get the maxBufferSize for the closest maxDepth (reversing it to get the largest buffer by default)
  const maxBufferSize =
    ALL_DEPTH_SIZE_PAIRS.filter((pair) => pair.maxDepth == maxDepth)?.[0]?.maxBufferSize ??
    defaultDepthPair.maxBufferSize

  // canopy depth must not be above 17 or else it no worky,
  const maxCanopyDepth = maxDepth >= 20 ? 17 : maxDepth

  return {
    maxDepth,
    maxBufferSize,
    canopyDepth: maxCanopyDepth - 3 >= 0 ? maxCanopyDepth - 3 : 0,
  }
}

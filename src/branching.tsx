export const branchColors = ["darkblue", "green", "grey", "brown", "orange"];

//Branching:
//  initNode at distanceR || distance
//  if branch.branchLength then
//    animateBranch
//    initNode(branch.nodes[0])
//    initNode(branch.nodes[1])

export interface Branch {
  distance: number;
  distanceR?: number;
  branchLength?: number;
  nodes?: (Branch | null)[];
}

export const generateBranches = (dim: number): Branch[] => {
  const dims: { [int: number]: number } = Array.from(
    { length: 30 },
    (_, i) => i + 1
  ).reduce((acc, i) => ({ ...acc, [i]: Math.floor(dim / i) }), {});

  return [
    {
      distance: dims[7],
      distanceR: dims[4],
      branchLength: dims[10],
      nodes: [
        {
          distance: dims[3],
          branchLength: dims[10],
          nodes: [
            { distance: dims[10] },
            {
              distance: dims[4],
            },
          ],
        },
        {
          distance: dims[6],
          branchLength: dims[11],
          nodes: [
            { distance: dims[8] },
            {
              distance: dims[9],
              branchLength: dims[10],
              nodes: [{ distance: dims[10] }, { distance: dims[10] }],
            },
          ],
        },
      ],
    },
    {
      distance: dims[7],
      branchLength: dims[5],
      nodes: [
        {
          distance: dims[8],
          branchLength: dims[10],
          nodes: [
            {
              distance: dims[7],
              branchLength: dims[15],
              nodes: [
                {
                  distance: dims[8],
                  branchLength: dims[14],
                  nodes: [{ distance: dims[9] }, { distance: dims[9] }],
                },
                { distance: dims[6] },
              ],
            },
            {
              distance: dims[12],
              branchLength: dims[12],
              nodes: [
                {
                  distance: dims[12],
                },
                {
                  distance: dims[9],
                  branchLength: dims[10],
                  nodes: [
                    {
                      distance: dims[9],
                      branchLength: dims[10],
                      nodes: [{ distance: dims[9] }, { distance: dims[9] }],
                    },
                    { distance: dims[9] },
                  ],
                },
              ],
            },
          ],
        },
        {
          distance: dims[6],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[8],
            },
            {
              distance: dims[8],
              branchLength: dims[13],
              nodes: [
                {
                  distance: dims[6],
                },
                { distance: dims[10] },
              ],
            },
          ],
        },
      ],
    },
    {
      distance: dims[8],
      distanceR: dims[6],
      branchLength: dims[7],
      nodes: [
        {
          distance: dims[15],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[15],
              branchLength: dims[20],
              nodes: [
                {
                  distance: dims[20],
                  branchLength: dims[20],
                  nodes: [{ distance: dims[20] }, { distance: dims[20] }],
                },
                {
                  distance: dims[20],
                  branchLength: dims[20],
                  nodes: [null, { distance: dims[20] }],
                },
              ],
            },
            {
              distance: dims[15],
              branchLength: dims[20],
              nodes: [
                {
                  distance: dims[20],
                  branchLength: dims[20],
                  nodes: [{ distance: dims[20] }, { distance: dims[20] }],
                },
                null,
              ],
            },
            // { distance: dims[15], branchLength: dims[20] }
          ],
        },
        {
          distance: dims[15],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[15],
              branchLength: dims[20],
              nodes: [
                {
                  distance: dims[20],
                  branchLength: dims[20],
                  nodes: [{ distance: dims[20] }, { distance: dims[20] }],
                },
                {
                  distance: dims[20],
                  branchLength: dims[20],
                  nodes: [null, { distance: dims[20] }],
                },
              ],
            },
            {
              distance: dims[15],
              branchLength: dims[20],
              nodes: [
                {
                  distance: dims[20],
                  branchLength: dims[20],
                  nodes: [{ distance: dims[20] }, { distance: dims[20] }],
                },
                {
                  distance: dims[20],
                  branchLength: dims[20],
                  nodes: [null, { distance: dims[20] }],
                },
              ],
            },
            // { distance: dims[15], branchLength: dims[20] }
          ],
        },
      ],
    },
    {
      distance: dims[10],
      branchLength: dims[7],
      nodes: [
        {
          distance: dims[11],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[12],
              branchLength: dims[9],
              nodes: [
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
              ],
            },
            {
              distance: dims[12],
            },
          ],
        },
        {
          distance: dims[11],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[10],
              distanceR: dims[16],
              branchLength: dims[9],
              nodes: [
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
                {
                  distance: dims[13],
                },
              ],
            },
            {
              distance: dims[12],
              branchLength: dims[9],
              nodes: [
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
                {
                  distance: dims[13],
                  branchLength: dims[11],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      distance: dims[8],
      branchLength: dims[8],
      nodes: [
        {
          distance: dims[8],
          branchLength: dims[8],
          nodes: [{ distance: dims[10] }, { distance: dims[10] }],
        },
        {
          distance: dims[8],
          branchLength: dims[8],
          nodes: [{ distance: dims[10] }, { distance: dims[10] }],
        },
      ],
    },
  ];
};

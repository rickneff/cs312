var cubeData = [
"o cube",
"",
"# front +Z",
"v -1  1  1",
"v  1  1  1",
"v  1 -1  1",
"v -1 -1  1",
"",
"# back -z",
"v -1  1 -1",
"v  1  1 -1",
"v  1 -1 -1",
"v -1 -1 -1",
"",
"# normals for each face",
"vn  1  0  0",
"vn -1  0  0",
"vn  0  1  0",
"vn  0 -1  0",
"vn  0  0  1",
"vn  0  0 -1",
"",
"# UV coordinates",
"vt 0 1",
"vt 1 1",
"vt 1 0",
"vt 0 0",
"",
"# 2 triangles per face",
"# front +z",
"f 1/1/5 3/3/5 2/2/5",
"f 1/1/5 4/4/5 3/3/5",
"",
"# back -z",
"f 5/2/6 6/1/6 7/4/6",
"f 5/2/6 7/4/6 8/3/6",
"",
"# left -x",
"f 5/1/2 4/3/2 1/2/2",
"f 5/1/2 8/4/2 4/3/2",
"",
"# right +x",
"f 2/1/1 7/3/1 6/2/1",
"f 2/1/1 3/4/1 7/3/1",
"",
"# top +y",
"f 5/1/3 2/3/3 6/2/3",
"f 5/1/3 1/4/3 2/3/3",
"",
"# bottom -y",
"f 4/1/4 7/3/4 3/2/4",
"f 4/1/4 8/4/4 7/3/4"];
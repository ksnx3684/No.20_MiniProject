const returnValue = [
  {
    postId: 1,
    UserId: 1,
    nickname: "nickname_1",
    title: "title_1",
    content: "content_1",
    likes: 10,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    postId: 2,
    UserId: 2,
    nickname: "nickname_2",
    title: "title_2",
    content: "content_2",
    likes: 10,
    status: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    postId: 3,
    UserId: 3,
    nickname: "nickname_3",
    title: "title_3",
    content: "content_3",
    likes: 10,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const compareValue = [returnValue[0], returnValue[2]];

console.log(compareValue);

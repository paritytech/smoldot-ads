export const definitions = {
  types: {
    AdId: "u32",
    CommentId: "u32",
    Ad: {
      author: "AccountId",
      selected_applicant: "Option<AccountId>",
      title: "Vec<u8>",
      body: "Vec<u8>",
      tags: "Vec<Vec<u8>>",
      created: "u64",
      num_of_comments: "u32",
    },
    Comment: {
      author: "AccountId",
      body: "Vec<u8>",
      created: "u64",
    },
  },
}

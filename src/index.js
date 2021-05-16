const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

// dummy data
let links = [
  {
    id: 'link-0',
    url:
      'https://aaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com/',
    description: 'A URL Lengthener',
  },
];

let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews clone`,
    feed: () => links,
    link: (parent, args) => links.find((links) => links.id === args.id),
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${(idCount += 1)}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const linkIdx = links.indexOf(links.find((link) => link.id === args.id));
      links[linkIdx] = {
        id: links[linkIdx].id,
        description: args.description || links[linkIdx].description,
        url: args.url || links[linkIdx].url,
      };
      return links[linkIdx];
    },
    deleteLink: (parent, args) => {
      const link = links.find((links) => links.id === args.id);
      links = links.filter((links) => links.id !== args.id);
      return link;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

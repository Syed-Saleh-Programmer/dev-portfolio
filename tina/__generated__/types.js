export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const WorkPartsFragmentDoc = gql`
    fragment WorkParts on Work {
  __typename
  title
  summary
  previewImage
  liveLink
  githubLink
  year
  role
  techStack
  gallery {
    __typename
    image
    caption
  }
  body
}
    `;
export const ExperiencePartsFragmentDoc = gql`
    fragment ExperienceParts on Experience {
  __typename
  role
  company
  duration
  location
  description
}
    `;
export const HobbyPartsFragmentDoc = gql`
    fragment HobbyParts on Hobby {
  __typename
  title
  category
  date
  location
  tagline
  photos {
    __typename
    image
    caption
    rotation
  }
  body
}
    `;
export const ProfilePartsFragmentDoc = gql`
    fragment ProfileParts on Profile {
  __typename
  name
  title
  shortBio
  aboutParagraphs
  resumeLink
  certifications {
    __typename
    name
    issuer
    date
    image
    credentialUrl
    skills
  }
  aiBuddyPrompt
}
    `;
export const WorkDocument = gql`
    query work($relativePath: String!) {
  work(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...WorkParts
  }
}
    ${WorkPartsFragmentDoc}`;
export const WorkConnectionDocument = gql`
    query workConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: WorkFilter) {
  workConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...WorkParts
      }
    }
  }
}
    ${WorkPartsFragmentDoc}`;
export const ExperienceDocument = gql`
    query experience($relativePath: String!) {
  experience(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ExperienceParts
  }
}
    ${ExperiencePartsFragmentDoc}`;
export const ExperienceConnectionDocument = gql`
    query experienceConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ExperienceFilter) {
  experienceConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ExperienceParts
      }
    }
  }
}
    ${ExperiencePartsFragmentDoc}`;
export const HobbyDocument = gql`
    query hobby($relativePath: String!) {
  hobby(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HobbyParts
  }
}
    ${HobbyPartsFragmentDoc}`;
export const HobbyConnectionDocument = gql`
    query hobbyConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HobbyFilter) {
  hobbyConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HobbyParts
      }
    }
  }
}
    ${HobbyPartsFragmentDoc}`;
export const ProfileDocument = gql`
    query profile($relativePath: String!) {
  profile(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ProfileParts
  }
}
    ${ProfilePartsFragmentDoc}`;
export const ProfileConnectionDocument = gql`
    query profileConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ProfileFilter) {
  profileConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ProfileParts
      }
    }
  }
}
    ${ProfilePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    work(variables, options) {
      return requester(WorkDocument, variables, options);
    },
    workConnection(variables, options) {
      return requester(WorkConnectionDocument, variables, options);
    },
    experience(variables, options) {
      return requester(ExperienceDocument, variables, options);
    },
    experienceConnection(variables, options) {
      return requester(ExperienceConnectionDocument, variables, options);
    },
    hobby(variables, options) {
      return requester(HobbyDocument, variables, options);
    },
    hobbyConnection(variables, options) {
      return requester(HobbyConnectionDocument, variables, options);
    },
    profile(variables, options) {
      return requester(ProfileDocument, variables, options);
    },
    profileConnection(variables, options) {
      return requester(ProfileConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/3.0/content/aec42b92-5ef2-4746-8bd4-e5c956165e48/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};

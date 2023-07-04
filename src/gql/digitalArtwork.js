import { gql } from "@apollo/client";
export const All_DIGITAL_ARTWORKS = gql`
  query MyQuery($limit: Int!, $offset: Int!, $search: String!) {
    digital_art_work(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: { artwork_name: { _ilike: $search } }
    ) {
      id
      artwork_name
    }
    digital_art_work_aggregate {
      aggregate {
        count
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const IMAGE_UPLOAD = gql`
  mutation image_upload($contentType: String!) {
    getImageUploadUrl(contentType: $contentType) {
      contentType
      error
      imageUploadUrl
      imageName
      message
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation delete_image($image_name: String!) {
    deleteImage(imageName: $image_name) {
      error
      message
    }
  }
`;

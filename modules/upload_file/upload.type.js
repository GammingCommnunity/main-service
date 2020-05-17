gql`
      type File {
        filename: String!
        mimetype: String!
        encoding: String!
      }
   
    

    type UploadImage{
        code: String!
        success: Boolean!
        message: String!
        image_url:String
    }
    upload(
            file: Upload!,
            userID:String,
            type:Int):UploadImage
`
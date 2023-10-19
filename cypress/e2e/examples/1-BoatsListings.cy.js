
let token;
let extractIdFromResponse;
let dealerIdFromListing;
let dealerNameFromListing;

describe('API Request Test', () => {
  it('Get access token for Nebulous api', () => {
    //let token
    // Define the request parameters
    const url = 'https://api-dev.traderonline.com/vLatest/token';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const parameters = {
      client_id: "traxx-qa-automation",
      client_secret: "Fu8Whay1W95En9oKeOxDx1KExJXE80xq",
      base_url: "https://api-dev.traderonline.com/vLatest/token",
    };
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', 'traxx-qa-automation');
    formData.append('client_secret', 'Fu8Whay1W95En9oKeOxDx1KExJXE80xq');
    // Perform the API request
    cy.request({
      method: 'POST',
      url: url,
      headers: headers,
      form: true, // Indicate that the body is form-urlencoded
      body: formData.toString(), // Convert form data to string
      qs: parameters // Set query parameters
    }).then((response) => {
      
      // Assertions on response
      expect(response.status).to.equal(200);
      expect(response.body.access_token).to.not.be.null;
      
      // Log the JSON response body
      cy.log('Response Body:', JSON.stringify(response.body));

      // Extract values from the response body
      const access_tokenValue = response.body.access_token;
      const expires_inValue = response.body.expires_in;
      const token_typeValue = response.body.token_type;
      const scopeValue = response.body.scope;
      token = response.body.access_token;
      
      // Print extracted values
      cy.log('Token', token);
      cy.log('access_token', access_tokenValue);
      cy.log('expires_in', expires_inValue);
      cy.log('token_type', token_typeValue);
      cy.log('scope', scopeValue);
    });     
  
  });
    it('Get total listing with page limit',()=>
    {
      cy.request({
        method: 'GET',
        url:'https://api-dev.traderonline.com/vLatest/boats',
        headers:{
              Authorization:"Bearer "+token
        },
        qs:
        { 
          limit:'1'
        }              
      }
      )
      .then((response)=>{
        
        expect(response.status).to.equal(200)
        // Log the JSON response body
        cy.log('Response Body:',JSON.stringify(response.body))  
        
        // Extract values from the response body
        const limit_value = response.body.pagination.limit;

        //const result = response.body.result.toString;
        totalIdFromResponse=response.body.result
        extractIdFromResponse=response.body.result[0].id;


        // Print extracted limit values
        cy.log('Set limit to: ', limit_value);
        cy.log('Total number of listing : ',totalIdFromResponse)
        cy.log('Extracted Id From Response: ', JSON.stringify(extractIdFromResponse));
    

      }) 
    });
    it('Get Inventory details using inventory id',()=>
    {
      cy.request({
        method: 'GET',
        url:'https://api-dev.traderonline.com/vLatest/boats/'+extractIdFromResponse,
        headers:{
              Authorization:"Bearer "+token
        },            
      }
      )
      .then((response)=>{
        
        expect(response.status).to.equal(200)
        // Log the JSON response body
        cy.log('Response Body:',JSON.stringify(response.body))  
               
        // Extract values from the response body
        const extractUrlFromResponse = response.body.url;
        const extractIdFromInventoryDetailsResponse=response.body.result.id;

        let id=parseInt(extractIdFromResponse);
        let Inventoryid=parseInt(extractIdFromInventoryDetailsResponse);
        expect(Inventoryid).to.equal(id)

        // Print extracted limit values
        cy.log('Extracted Url From Response', JSON.stringify(extractUrlFromResponse));
        cy.log('Extract Id From Response', JSON.stringify(extractIdFromInventoryDetailsResponse));

      }) 
    }
    )
  });
//


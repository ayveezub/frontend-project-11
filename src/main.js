import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container bg-dark py-5">
      <div class="row justify-content-center">
          <div class="col-12 col-sm-8 col-md-6">
              <h2 class="text-center mb-4">Add RSS Feed</h2>
                
              <form class="bg-white p-4 rounded shadow-sm">
                  <div class="mb-3">
                      <input type="url" class="form-control form-control-lg" placeholder="Enter RSS URL" required>
                  </div>
                    
                  <button type="submit" class="btn btn-primary btn-lg w-100">Add Feed</button>
              </form>
          </div>
      </div>
  </div>
`

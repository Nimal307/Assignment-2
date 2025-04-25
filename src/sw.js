let CACHE_NAME = "cache-v2";
let CACHE_URLS = [
    "/",
    "/index.html",
    "/about/",

    //recipes
    "/recipes/",
    "/recipes/coconut-lentil-soup/",
    "/recipes/courgette-lemon-risotto/",
    "/recipes/simple-brownies/",

    "/search.json",
    //tags
    "/tags/all/",
    "/tags/cake/",
    "/tags/favourite/",
    "/tags/italian/",
    "/tags/recipes/",
    "/tags/sharable/",
    "/tags/soup/",
    "/tags/sweet/",
    "/tags/taglist/",
    "/tags/vegan/",
    "/tags/vegetarian/",
    
    //images
    "/img/about.jpg",
    "/img/recipes/57d2352f-600.jpeg",
    "/img/recipes/57d2352f-600.webp",
    "/img/recipes/57d2352f-1500.jpeg",
    "/img/recipes/57d2352f-1500.webp",
    "/img/recipes/a3bdd18d-600.jpeg",
    "/img/recipes/a3bdd18d-600.webp",
    "/img/recipes/a3bdd18d-1500.jpeg",
    "/img/recipes/a3bdd18d-1500.webp",
    "/img/recipes/brownies.jpg",
    "/img/recipes/coconut-lentil-soup.jpg",
    "/img/recipes/courgette-lemon-risotto.jpg",
    "/img/recipes/d5fadb0c-600.jpeg",
    "/img/recipes/d5fadb0c-600.webp",
    "/img/recipes/d5fadb0c-1500.jpeg",
    "/img/recipes/d5fadb0c-1500.webp",

    //fonts
    "/fonts/Vollkorn-Regular.woff",
    "/fonts/Vollkorn-Regular.woff2",
    "/fonts/Vollkorn-SemiBold.woff",
    "/fonts/Vollkorn-SemiBold.woff2",

];

// Pre-caching essential files during sw installation
self.addEventListener("install",event =>{
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>{
            return cache.addAll(CACHE_URLS);
        }
        )
    );
}
);

// Handle fetch requests
self.addEventListener("fetch",event =>{
  var requestURL = new URL(event.request.url);

  // Use cache, falling back to network with frequent updates strategy
  if(requestURL.pathname === "/" || requestURL.pathname === "/index.html"){
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>{
        return cache.match("/index.html").then(cachedResponse=>{
        var fetchPromise = fetch("/index.html")
        .then(networkResponse =>{
          cache.put("/index.html", networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
        });
      })
    )
  }

  // Use cache, falling back to network with frequent updates strategy
  else if(requestURL.pathname === "/about/"){
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>{
        return cache.match("/about/").then(cachedResponse=>{
        var fetchPromise = fetch("/about/")
        .then(networkResponse =>{
          cache.put("/about/", networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
        });
      })
    )
  }

  // Use cache on demand for recipe pages
  else if(requestURL.pathname.startsWith("/recipes/")){
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>{
        return cache.match(event.request).then(cachedResponse =>{
          return cachedResponse || fetch(event.request).then(
            networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
          );
        })
      })
    );
  }
  
  // Use cache on demand for images
  else if(requestURL.pathname.startsWith("/img/")){
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>{
        return cache.match(event.request).then(cachedResponse =>{
          return cachedResponse || fetch(event.request).then(
            networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
          );
        })
      })
    );
  }

  // Use cache on demand for fonts
  else if(requestURL.pathname.startsWith("/fonts/")){
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>{
        return cache.match(event.request).then(cachedResponse =>{
          return cachedResponse || fetch(event.request).then(
            networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
          );
        })
      })
    );
  }

  // Use cache on demand for tags
  else if(requestURL.pathname.startsWith("/tags/")){
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>{
        return cache.match(event.request).then(cachedResponse =>{
          return cachedResponse || fetch(event.request).then(
            networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
          );
        })
      })
    );
  }
  
  // Use cache-first for search
  else if(requestURL.pathname === "search.json")
  {
    event.respondWith(
    caches.match(event.request).then(response =>{
          return response || fetch(event.request);
        }
        )
      );
  }
}        
);

// Clean up old caches during the sw activation by deleting caches not matching
// the current CACHE_NAME.
self.addEventListener("activate", event=> {
    event.waitUntil(
      caches.keys().then(cacheNames=> {
        return Promise.all(
          cacheNames.map(cacheName=> {
            if (CACHE_NAME !== cacheName && cacheName.startsWith("cache-v")) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
   });
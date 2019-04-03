const userSvc = function($http){
    const svc = this

    svc.getUser = () => {
        return  $http({ method: 'GET', url: '/api/users'})
    }

    svc.login = (username, password) =>{
        let obj = {
            username: username,
            password: password
        }

        return $http({ method: 'POST', url: '/api/sessions', data: obj })
        .then((token) => {
            svc.token = token.data
            $http.defaults.headers.common['X-Auth'] = token.data
            sessionStorage.userToken = svc.token
            return svc.getUser()
        })
    }

    svc.logout = () =>{
        delete $http.defaults.headers.common['X-Auth']
    }

    svc.userState = () => {
        if(sessionStorage.userToken){
            svc.token = sessionStorage.userToken
            $http.defaults.headers.common['X-Auth'] = sessionStorage.userToken            
        }
        return svc.getUser()
    }

}
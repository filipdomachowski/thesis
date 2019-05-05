const userSvc = function($http, toast){
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
        }, function(){
            toast({
                duration: 5000,
                message: 'Bład logowania. Sprawd hasło lub nazwę użytkownika',
                className: 'alert-danger'
            })
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
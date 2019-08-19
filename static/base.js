const app = new Vue({
    delimiters: ['[[', ']]'],
    el: '#app',
    data: {
        name: 'Anonymous',
        avatar: '/static/img/anon.png',
        friends: [],
        count: 0,
        offset: 0
    },
    methods: {
        next_friends() {
            var self = this;
            self.offset += 5;
            self.get_some_friends();
        },
        prev_friends() {
            var self = this;
            self.offset -= 5;
            self.get_some_friends();
        },
        get_user_info() {
            var self = this;
            VK.Api.call('users.get', {
                access_token: backend.access_token,
                fields: 'photo_400_orig,photo_200',
                v: '5.73'
            }, function(r) {
                self.name = r.response[0].first_name + ' ' + r.response[0].last_name;
                self.avatar = r.response[0].photo_400_orig || r.response[0].photo_200 || '/static/img/anon.png';
            });
        },
        get_some_friends() {
            var self = this;
            VK.Api.call('friends.get', {
                access_token: backend.access_token,
                count: 5,
                offset: self.offset,
                fields: 'photo_200',
                v: '5.73'
            }, function(r) {
                self.friends = r.response.items;
                self.count = r.response.count;
            });
        }
    }
});

(function() {
    // VK Open API
    VK.init({
        apiId: backend.apiId
    });
    // If user is authenticated on backend
    if (backend.access_token) {
        app.get_some_friends();
        app.get_user_info();
    }
})();

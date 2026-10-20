from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):#огранич прав доступ на уровне всего запроса
        if request.method in permissions.SAFE_METHODS:
            return True#доступ для всех пользв

        return bool(request.user and request.user.is_staff)#а иначе только для админа


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):#для конкретной записи, на уровне обьекта
        if request.method in permissions.SAFE_METHODS:
            return True


        return obj.user == request.user#если юзер из бд == юзеру запросу, тогда даем доступ
"""
Create middleware here, don't forget to add it to the MIDDLEWARE list
in your Django settings.

Reference:
https://docs.djangoproject.com/en/2.0/topics/http/middleware/

"""
# coding=utf-8

import sys

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission, ContentType
from django.core.exceptions import PermissionDenied
from django.http.response import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.views.debug import technical_500_response

from common.exceptions import ECloudException
from common.mixin import ret_format
from common.utils.text_ import UUID


class CommonMiddleware(MiddlewareMixin):

    def __init__(self, get_response):
        # self.get_response = get_response
        super().__init__(get_response)
        # One-time configuration and initialization.

        # Initialize first starting of the system
        #
        # TODO: create initial users, write custom migrations later
        if not Permission.objects.filter(codename='list_permission').exists():
            user_model = get_user_model()
            if not user_model.objects.filter(username='admin'):
                user_model().create_superuser('admin',
                                              'admin@example.com',
                                              'password', id=UUID.uuid4)

            # add extra permissions
            group_ct_id = ContentType.objects.get(model='group').id
            perms_ct_id = ContentType.objects.get(model='permission').id
            perms = [
                (perms_ct_id, 'permission', 'list_permission', 'Can list permission'),
                (perms_ct_id, 'permission', 'detail_permission', 'Can detail permission'),
                (group_ct_id, 'group', 'list_group', 'Can list group'),
                (group_ct_id, 'group', 'detail_group', 'Can detail group'),
                (group_ct_id, 'group', 'update_group_permission', 'Can change group permission'),
            ]
            for item in perms:
                model_name, code_name, name = item[1], item[2], item[3]
                Permission.objects.get_or_create(name=name,
                                                 codename=code_name,
                                                 content_type_id=item[0])

    # def __call__(self, request):
    #     # Code to be executed for each request before
    #     # the view (and later middleware) are called.
    #     super().__call__(request)
    #     response = self.get_response(request)
    #
    #     # Code to be executed for each request/response after
    #     # the view is called.
    #
    #     return response

    # def process_view(self, request, view_func, *view_args, **view_kwargs):
    #     """
    #     call before view executing
    #     :param request:
    #     :return: None or an HttpResponse object
    #     """
    #     return None

    def process_exception(self, request, exception):
        """
        当抛出异常时调用。
        :param request:
        :param exception:
        :return:
        """
        if isinstance(exception, ECloudException):
            if request.method in ('POST', 'PUT', 'DELETE'):

                return JsonResponse(
                    ret_format(result=False, messages=exception.desc,
                               level=exception.level, code=exception.code))
            elif request.method == 'GET':
                pass
            else:
                # other HTTP methods
                pass
        else:
            # django or openstack exceptions

            if request.method in ('POST', 'PUT', 'DELETE'):
                code = 0
                level = None
                data = None
                if isinstance(exception, PermissionDenied):
                    messages = "You don't have permission to do this"
                    level = 'warning'
                    code = 403
                else:
                    messages = str(exception)

                return JsonResponse(
                    ret_format(result=False, messages=messages,
                               code=code, level=level, data=data)
                )
    # def process_request(self, request):
    #     return request

    # def process_response(self, request, response):
    #     path = request.path_info.strip('/').split('/')
    #     response = self.get_response(request)
    #     if not hasattr(response, 'context_data'):
    #         response.context_data = {}
    #     bc = list()
    #     for i in range(len(path)):
    #         bc.append({'path': '/%s/' % '/'.join(path[:i + 1]),
    #                    'name': path[i].capitalize()})
    #     response.context_data['breadcrumb_paths'] = bc
    #     return response

    def process_template_response(self, request, response):
        """
        call after view finished
        objects returned by view must contain render method, such as
        django.template.response.TemplateResponse
        :param request:
        :param response:
        :return:
        """
        path = request.path_info.strip('/').split('/')

        if not response.context_data:
            response.context_data = {}
        # add menu
        # response.context_data['side_nav_menus'] = self.menus_obj

        # add breadcrumb
        bc = list()
        for i in range(len(path)):
            bc.append({'path': '/%s/' % '/'.join(path[:i + 1]),
                       'name': path[i].capitalize()})
        response.context_data['breadcrumb_paths'] = bc

        return response


class UserBasedExceptionMiddleware(MiddlewareMixin):
    """
    Let superuser see debug page when exception happens
    """

    def process_exception(self, request, exception):
        if request.user.is_superuser or request.META.get('REMOTE_ADDR') in settings.INTERNAL_IPS:
            return technical_500_response(request, *sys.exc_info())

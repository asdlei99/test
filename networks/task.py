from celery import shared_task


@shared_task(bind=True, name='compute.create_server', rate_limit='10/m')
def create_volume():
    pass
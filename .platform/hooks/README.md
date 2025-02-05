# Important Log File Locations on EC2

The following log files are important for debugging:

1. Nginx Error Log: `/var/log/nginx/error.log`
2. Nginx Access Log: `/var/log/nginx/access.log`
3. Application Log: `/var/log/web.stdout.log`
4. Application Error Log: `/var/log/web.stderr.log`

To view these logs when SSH'd into the instance:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/web.stdout.log
sudo tail -f /var/log/web.stderr.log
``` 
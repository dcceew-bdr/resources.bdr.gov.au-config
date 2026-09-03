ARG FUSEKI_VERSION=6.2.0-0
FROM ghcr.io/kurrawong/fuseki:${FUSEKI_VERSION}

COPY --chown=fuseki:fuseki config-refdata.ttl /opt/fuseki/configuration/refdata.ttl
COPY --chown=fuseki:fuseki shiro.ini /opt/fuseki/shiro.ini
COPY --chown=fuseki:fuseki entrypoint.sh /opt/fuseki/refdata-entrypoint.sh

RUN chmod +x /opt/fuseki/refdata-entrypoint.sh

CMD ["/opt/fuseki/refdata-entrypoint.sh"]

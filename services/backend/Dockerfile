FROM wordpress:6-apache

RUN apt-get update && apt-get install -y unzip wget && rm -rf /var/lib/apt/lists/*

# Install WPGraphQL plugin
RUN wget -O /tmp/wp-graphql.zip https://downloads.wordpress.org/plugin/wp-graphql.latest-stable.zip \
    && unzip /tmp/wp-graphql.zip -d /usr/src/wordpress/wp-content/plugins/ \
    && rm /tmp/wp-graphql.zip

EXPOSE 80

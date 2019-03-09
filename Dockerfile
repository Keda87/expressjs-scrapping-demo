FROM node:10.14.2

RUN mkdir /sourcecode
WORKDIR /sourcecode
COPY package.json /sourcecode

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

RUN npm install
COPY . /sourcecode

## Launch the wait tool and then your application
CMD /wait
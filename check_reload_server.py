from livereload import Server, shell
server = Server()
server.watch('.', shell('rake publish'))
server.serve(root='_site/')

import os


def highlight(content):
    for i in range(len(content)):
        if ("```" in content[i]) and ("python" in content[i]):
            content[i] = "{% highlight python %}\n"
        if ("```" in content[i]) and ("python" not in content[i]):
            content[i] = "{% endhighlight %}\n \n"
    return content


def titles(content):
    for i in range(len(content)):
        hashtags = count_hashtags(content[i])
        if content[i][hashtags] != " " and hashtags > 0:
            content[i] = content[i][:hashtags] + " " + content[i][hashtags:]
    return content


def count_hashtags(line):
    i = 0
    while line[i] == "#":
        i += 1
    return i


def table_of_contents(content):
    for i in range(len(content)):
        if content[i].lower() == "table of contents":
            for k in range(30):
                content[i + k] = edit_link_toc(content[i + k])
            return content
    return content


def edit_link_toc(line):
    if ("(" in line) and (")" in line) and ("[" in line) and ("]" in line) and ("#" in line):
        first = line.index("(")
        last = line.index(")")
        line[first:last] = line[first:last].lower()
    return line


def get_main_title(content):
    for i in range(min(50, len(content))):
        if count_hashtags(content[i]) == 1:
            title = content[i][1:]
            return title, i
    return "", -1


def one_line_quote(content):
    new_content = []
    i = 0
    while i < len(content):
        print content[i][
                    len(content[i]) - len(content[i].strip()) - 1
                    ]
        if content[i][
                    len(content[i]) - len(content[i].strip()) - 1
                    ] == ">":
            line = ""
            while content[i] != "":
                print content[i]
                line += content[i]
                i += 1
            new_content.append(line)
            print '\n'
        else:
            new_content.append(content[i])
            i += 1
    return new_content


def front_matter(content):
    if '---' not in content[0] and 'layout' not in content[1]:
        if content[0][0] != "-":
            matter = "---\nlayout: post\n\n"
            matter += "author:\n  name: Victor Schmidt"
            matter += "\n  twitter: vict0rsch\n\n"
            title, index = get_main_title(content)
            matter += "title: " + title + "\n\n---\n\n"

            if index > 0:
                content[index] = ""

            new_content = []
            new_content.append(matter)
            for line in content:
                new_content.append(line)

            return new_content
    return content


def check_file(file_name):
    print 'go'
    with open(file_name, 'r') as f:
        content = f.readlines()
        print 'readlines'
        content = front_matter(content)
        print 'front_matter'
        content = highlight(content)
        print "highlight"
        content = titles(content)
        print 'titles'
        content = table_of_contents(content)
        print 'table_of_contents'
        content = one_line_quote(content)
        print 'one_line_quote'

    with open(file_name + 'test', "w") as f2:
        for line in content:
            f2.write(line)
    print 'write'

    os.remove(file_name)
    os.rename(file_name + 'test', file_name)

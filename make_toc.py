from collections import defaultdict
from string import ascii_lowercase


def get_toc_tuples(file_path, depth=3):
    has_toc = False
    with open(file_path, "r") as f:
        lines = f.readlines()

    toc = []
    for l in lines:
        if l.startswith("#"):
            h_type = len(l.split("#")) - 1
            title = l.split("#")[-1][1:-1]
            if title == "Table of Contents:":
                has_toc = True
            else:
                if h_type <= depth:
                    toc.append((title, h_type))
    return toc, has_toc


def get_links_from_tuples(tuples):
    link_tuples = [
        (
            '<a href="#{}">{}</a>\n'.format(
                title.lower()
                .replace(" ", "-")
                .replace("?", "")
                .replace("(", "")
                .replace(")", "")
                .replace("`", ""),
                title,
            ),
            title,
            h_type,
        )
        for title, h_type in tuples
    ]

    return link_tuples


def get_toc_from_links(links):
    toc = ["\n## Table of Contents:\n\n"]
    current = defaultdict(int)
    items = {
        1: list(range(20)),
        2: [0] + list(ascii_lowercase),
        3: [0]
        + ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"],
    }
    for link, _title, h_type in links:
        if h_type == 1:
            current[h_type] += 1
            current[2] = 0
            current[3] = 0
        elif h_type == 2:
            current[h_type] += 1
            current[3] = 0
        elif h_type == 3:
            current[h_type] += 1

        toc += [
            "{}{}. {}".format(
                "&nbsp;" * h_type * 6, items[h_type][current[h_type]], link
            )
        ]

    return toc


def drop_toc(toc, file_path, count_separators=3):
    with open(file_path, "r") as f:
        lines = f.readlines()

    start = None
    end = None
    replace = False
    for i, l in enumerate(lines):
        if "Table of Contents" in l:
            start = i
        if "end-of-toc" in l:
            end = i + 1
        if " ==" in l:
            replace = True
            lines[i] = l.replace(" ==", "<span class='highlight'>")

    if start and end:
        lines = lines[:start] + lines[end:]
        print("deleted previous toc")

    if replace:
        for i, l in enumerate(lines):
            if "==" in l:
                lines[i] = l.replace("==", "</span>")

    count = 0
    new_lines_start = []
    new_lines_end = []
    for l in lines:
        if count < count_separators:
            new_lines_start.append(l)
        else:
            new_lines_end.append(l)
        if l.startswith("---"):
            count += 1
    new_lines_end = new_lines_end
    with open(file_path, "w") as f:
        f.writelines(
            new_lines_start
            + ["".join(toc + ['\n<br id="end-of-toc"/>'])]
            + new_lines_end
        )


def make_toc(file_path, update):
    """Create a Table of Content of the file in file_path

    Arguments:
        file_path {string} -- [file to create a TOC in]
        update {boolean} -- [if there is a TOC in the file, should it be updated?]
    """

    toc_tuples, has_toc = get_toc_tuples(file_path)
    if not has_toc or update:
        link_tuples = get_links_from_tuples(toc_tuples)
        toc = get_toc_from_links(link_tuples)
        drop_toc(toc, file_path)
    else:
        print("{} Already has a TOC".format(file_path))


if __name__ == "__main__":
    path = "./_posts/"
    file_to_TOC = "2016-12-03-aws_gpu.md"
    file_to_TOC_path = path + file_to_TOC
    should_update = True
    if "y" in input("Create TOC in " + file_to_TOC_path + "? "):
        make_toc(file_to_TOC_path, should_update)


from collections import p
for a, b, c, d in product(*([range(100)] * 4))
    if (
        float(a + b) / 4 == 8.0
        and float(a + c) / 4 == 13.0
        and float(c - d) / 4 == 6.0
        and float(b + d) / 4 == 8.0
    ):
        print(float(a + b) / 4, end=" ")
        print(float(a + c) / 4, end=" ")
        print(float(c + -d) / 4, end=" ")
        print(float(b + d) / 4, end=" and values are:")
        print(a / 4, end=" ")
        print(b / 4, end=" ")
        print(c / 4, end=" ")
        print(d / 4)

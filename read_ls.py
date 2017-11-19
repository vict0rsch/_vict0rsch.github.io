def get_list(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()

    files = []

    for l in lines:
        if len(l) > 1 and l[-2] == ':':
            folder = l.split(':')[0]

        if len(l.split('.')) > 1:
            if len({'JPG\n', 'LRV\n', 'THM\n'} & set(l.split('.'))) == 0:
                if folder != 'Japon':
                    files.append(folder + ', ' + l[:-1])
    return files


def to_csv(files, new_file_path):
    new_files = [f + ',\n' for f in files]
    with open(new_file_path, 'w') as f:
        f.writelines(new_files)


if __name__ == '__main__':
    path = '/Volumes/InspireTour/__MONTAGE VOYAGE/__MONTAGE/'
    file_path = path + 'ls.txt'
    new_file_path = path + 'ls.csv'
    to_csv(get_list(file_path), new_file_path)
    print('done')

from pathlib import Path
import glob


def replace(fn):
    with Path(fn).open('r') as f:
        lines = f.readlines()

    new_lines = []
    is_start = True
    no_lang = False
    for i, l in enumerate(lines):
        if '```' in l:
            if is_start:
                try:
                    lang = l.split('```')[-1].split('\n')[0].replace(' ', '')
                except:
                    lang = ''
                if lang:
                    print('replacing language {} at line {} in file {}'.format(
                        lang, i, fn
                    ))
                    new_lines += ['{% highlight ' + lang + ' %}\n']
                else:
                    new_lines += l
                    no_lang = True
                is_start = False
            else:
                try:
                    lang = l.split('```')[-1].split('\n')[0].replace(' ', '')
                except:
                    lang = ''
                if lang:
                    raise ValueError('Error. closing ``` might be missing in file', fn)
                if no_lang:
                    new_lines += l
                    no_lang = False
                else:
                    new_lines += ['{% endhighlight %}\n']
                is_start = True
        else:
            new_lines += [l]
    with Path(fn).open('w') as f:
        f.writelines(new_lines)


if __name__ == '__main__':
    print('Replacing ``` by highlight tags if a language is specified')
    path = Path().absolute()
    files = list(glob.iglob(str(path) + '/**/*.md', recursive=True))
    for filename in files:
        replace(filename)

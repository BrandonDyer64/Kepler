import handlebars from './Handlebars'

export default {
  name: 'Preprocess',
  parse(source, data) {
    source = source.replace(
      /[\s\/]*?#if (.*?)([\=\>\<\!\&\|]+)(.*?)\n/gi,
      "\n{{#ifCond $1 '$2' $3}}\n"
    )
    source = source.replace(
      /[\s\/]*?#if (.*?)\n/gi,
      "\n{{#ifCond $1 '==' true}}\n"
    )
    source = source.replace(/[\s\/]*?#endif[\s\/]*?\n/gi, '\n{{/ifCond}}\n')
    source = source.replace(/\/\*\@([\w\.]*?)\@\*\//gi, '{{$1}}')
    source = source.replace(/\@([\w\.]*?)\@/gi, '{{$1}}')
    console.log(source)
    return handlebars.parse(source, data)
  }
}

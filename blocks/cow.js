/****
 * Hardware spec:
 *  Pins:
 *    Gnd: Gnd on other Pico
 *    3.3v: B3 on other Pico
 *    B3: 3.3v on other Pico
 *    B6: B7 on other Pico
 *    B7: B6 on other Pico
 */

// Data value of block

var blockData = {
  stringValue: 'cow',
  integerValue: 1,
  imageValue: {
    width: 48,
    height: 45,
    bpp: 1,
    transparent: 0,
    buffer: "AAAAQAAAAAAD8AAAAAAf/AAAAAAf/AAAAAA//wAAAAB9vwAAAABgD8AAAADAB8AAD8DAD+AAP/mAD+Hgf/+AH+/8/3+AH///f4+AP///f9eAf/4fP/+A//n+P++B//n+D++D//n8Be+H//v4AA+P///wAA+f///AAA+f9/8AAAe///wAAAe///gAAAf///gAAAf///gAAAf///gAAAf///gAAAf///gAAAf///gAAAf///gAAAf///gAAAf///AAAA////AAAA////AAAA3//+AAAAB//8AAAAA//wAAADv//gAAAD/f/AAAAD/f+AAAAB+f4AAAAC9fwAAAAD/eAAAAAAD4AAAAAA/gAAAA"  // base64 encoded
  },
  soundValue: {
/*    samples: 5140,  // 1.285s @ 4000Hz
    bits: 8,
    buffer: "f3+AgICAgICAgICBgYGBgYGBgoKBgoGBgYGBgYCAgICAgICAgICAgH9/f39/f39+fn9/gICAgYGDhISFhoeHh4eIiIeHh4aFhYWEg4OCgoKBgYCCgH+AgH9+f35+fn18fHx8fn5+fn6AgoOEhYaHh4iIiImIiIiHhoaFhISDgoKBgYGAf39+fn59fHx7e3p5eXh4eXt7enp7fX9/f4CCgoKCg4SDg4KCgYGAf35+fHx7e3t7enp6enp6eXl5eXh4d3d3eHt7enp7fYCAgYKCg4WEhYaGhYWEhIOCgYB/fXx8e3p6enp6enl5eXh4d3Z1c3Jyc3V2dXV3enx9fX6AgYGBgYKCgoKBgH9+fXx6enl4eHh3d3d3d3Z2dXRzc3N0dHV1dnl7fX1+gIGBgYGCgoKCgYGAfn18e3p5eHd3dnZ2dnZ2dnV1dXR0c3BzdHR4enp5fH+Dg4SEhoiIiImJiYqKi4qJiIeGhYSDgoKBgICAgYKCgICAfn18eXl5en2AgICBhYmMjY2PkZGQkJGRkZCPj4+NjImIhoSDgoGAgH9/f39+fn17e3l3dXN1eXp5eHp9g4WFhYiKiYiJiYmIhoaGhYSCgX9+fHx7e3ZzeHh3dHd4eHl3d3h4eXx/gYCBhYySk5WVlp+gnZucnJqYl5iWk5CPjouJhoSEgn58fHx7eXp6eXh2dXV5e3t6fIGGi42OkJWWlZOUlpSTkZGRj42LioiGhIKBgX57e3t6eXl6eXh2dXR3e3p5eX2CiIqKjZCRj46PkI+Oi4mJiIeEgoF/fXx6enh1c3JycXFwb21tbGtscXV0c3R4foSFhYeLjoyLi4yLioaGhoaEgoGAfnx6eXh2dXR1dXV1dXV0cnBwc3l8fHx/ho2RkpOUl5aUk5KSkY+NjY2MiYaEgX57eHZ1c29ubmxsbGtpaGloa3BzcnR5f4aKi42QkZGPjo6NjYqIiYmJhoOBfnt4dXJxbWpqaWlpaGdlY2JhZWtsa2tweoKFhoaKjYuIh4eIh4SDgoODgH15dnNwbWpnZWJhYWJjY2FeXl5hZ2xrbHF4gYmMjo+Sk5KQkI+OjYyLioqKiISBfHh0b21qaGVkZWZnZ2NiY2Nma21rbXJ7g4eKi4+QjYyLioqJiYmKi4uKh4SAe3ZwbWppZ2RlZmdmYl9fYGRoZ2ZocHqChYiLjo+MiYiGhYOCgYCBgYB9enZzbmpoZWVkY2RnaGdkY2Rob3NwcHeAio+QkpabmpeVlJORkI+OjIyLhoF8eHVwa2dlZGNkZWZlYV1hZWpwcXFze4iSk5OUmJmXlZKSk5KPkI+PjIiEgH15dXFuaWVjZWdnZmNeW2Nvcm1sc3+IjY+TmJqYmJubl5SWlpSPjIqHfnZycG1nYV1bWllZWltZVVVhb3JsbXmHkZOWm56dmpuen5ydnp+cl5WVkYqBfn57dW9tbWtra2poYmFpeIB7eX+JlJqYmJmYlJKVl5WXnJ6cmJiXk4l/enl4dHFvb3FxcXFtZmNpeoN5dX+MkZGSk5CKhIWLjIWHk5qWkZCQiHpvaWhkXltaWVhYXV5XUVFdcXRobn2Iio6RjoiCgIiRjIuVnqOjpKiil42DgH11dXh1dHeAg395dnqJlYyHkpudo6ioop2YmqKkoKa0tK6wtLCklouDe29maGhiXWRqamNfZHSIgnd/kZKSlpeSh355goR8eoqSkI6SlpGFeXNxbGFiZGJhaW5vbW1xhJmRh4+dnaChoJmQh4WOjoWGlpqYlpmak4d7dnNsYmRlYmJqbnBvcHWLnpSMlqOjp6elnpePj5mYkZenp6WmqKObkIeBenFtbmhjZW5vbWptfZSQgYiWlpSampWJgHyHjIWDkZqWmJ2ck4mBgHxzaWxsY15kaGhnZm+GlYR6h5SRkJCNhX11eYOBeoGRkZCRlo6CcmxpYlRMTUhCQ0hHR0ZNY3x2aXB+goGCgXtwZ2h0dW5zgYSAgoeDe29lY2VgW1tXVVZeXFlbY3aNioGLmpycm5aOgXh2f4B6foyPiYuPin90bGVdWFdXU0tMVVZTUlhwg3pzgI+Qj42Ie2phZm9rZ3F+gX2BhoJ0amdkWk5QU1FMUFldXF1mf4d5e4+enZqZlYh3cHp/dnSDj46MkZSMem5tal5RT1RUTlFaXmBkdYV6cn6Qm5ePjIt8bXF7eHF3ho6Ki4+Pg3Rsa2deWVhcXVpjbnJ2hpuThIyapa+nnpyQgomRj4eGk56bk52ai3txbmtjXFtaXVRbbnZ7jpyJf4qSmp+Tk49/eICNioCFk52clZmYiXNwb2JTUFJRUk5cbnmFnJ2LipebpKOVk5GEgJGUj46XoKSjnp2aiHZ1cmhWVl9cV1tpe42fppSRmp6qrZ2Vk4eCjJaPi5GVnp+YmpmJeHVwY1pSUVdWVmNxgJunkoiWnqGnnI6LgniBjoiDi5GWmpWVlId0cG1iV1FPVVRUYW99mKiThpOdnqWdjIeAc3mHhH2EjY+Tko6MgW5nZVxOSkpLTE1abXuVrJyPm6attq2fmJKIj5+alZ6orLGtp6Sbhn9+cGJcXVtbXGV0hZunloyWn6GnnY6Ie3R+jIWAjpicn5yWjHxnZWVYRkVLRUFGV2l7lZiDg5GaoaeZi4Z6coGLgIKQmp+hnpmSfmloallJSlBNTFJgdY2mmYSNnZ6np5aOgnZ6jYt8gpSaoKGdmY52Z2tkUERLT0tLWmyBoKeRi5umqrSpm5iKgpKlmpSirra7uLWwoIiAgnhlXmVhY2l1iqO4qJGZqauvrp6WjH+FnJ2Pl6WvtbayrqSNfoB6al5lZGRqcoedubaZlqetrbCjlo6AfI+dj4uZpKutrKafjXh0c2ZZW19dXmd6kLG7oJOapaqwp5aQhYCImZWKk5ykqqeimYhyZ2RWSEZMSUhPYHqVsJ6GjpqdpKSQhH51d4+OfYaZn6eso5yNdGRnWkdARkJDS1dvkbSkio2Xm6CgkoR1aW+Ei4OBkJifo6ScjYFpaGNSQ0xRQ09hdZG9tZObpaaorqCMiHZ3k5mRkqCorq6vpZWGbmhjUUFIS0ZLVnCJrrCMjJybnJ6Sg3doZHqIfHmLkZadmpeJc1tTUEAuMjw4OkpigKemhISWkZOSh35xZV98hnp6iY+UnpiVi3ZcWE07LTE4NjtLZIavoIuImpyXlIJ/cWFlfoV3eIqJjJiQhX9kS0tBJx0hJCInO1Z7nYttenuNhXZxYVlMVW5zZ29/gouRiYd8ZFNMODU6NDY3QFVzpb2bj6OmpaqVf3xxZHeRjYOWoqGsrKSYhWxlX0gzNTk3P0tihLKzkpKjpKejiXt2bGeFk4yNoq+vurmwpZF9enRcTFJUVmB1kLvZwKq3yMHDs5qLg3t/npyQnK6wt7y1rZd+dGtdRT5DP0JScYm2u52Vp7CopZaAbmlqfYiEg5SgrLKrpp2IcGxhSzk2NElPXHmmzq+bpLKzs6SOfG1reY2NhI+kqbK0s6eZf3NwWkU/QT9GVG+SwsOln7G2uqefim9xbI6MhIKYpai0q6aZhW9rXkI0Nzk7QV15psCqk6KupaqWgG5gV3GEd3F/k5qgpJuNf2VgWD8mJSUlLkBcg7Cjio6ZnKCSeWtYTlt5eWhsg4+YnJmOemZdWUkwIicmLThUdqexkZCfo6ShinpmVVx/jX12i5ymr66pl35xdWZQPj88P05jhbDMtKe2vb6/qpeKdG+Pp56Rmay2xcK/s5mAhIFmVFBOTlpqh7HVw6y1wL7Ar5SKdGR4nZiIi5qjsbOup5BzbnRfR0FCO0RVbpPAuJiisrK0qYyBcV1pkJeEg5OcqbKtqJZ4a3RlS0FDPUFSaIm4vpmbra+wqo1+clxehJaEfIyWoa6sppl+aXBrUUNGRERTbom4y6mdsrq3tZyEeGlgfZyUg5CcpLGwqJuBZmVhTDc4NzlAYH+owKSQnK6qpY13Y1dQZoWHdXmHjpqaloVxWFZURjQxMTU7U3qgtZyKkaSooop3YFFRZHyDeXaCipaTkYJrUEhCMiMbGiEoP2qWp4yAh5admX5vV0NNYneBgYKMlqSgoZJ5ZGBZS0I7N0BMYI7Ax6ihprC4r4x/bFBZdoGEio6RmKihmIlsV1NIODUvKjNDW4m9upuboKOvonxyYkVVe399iZWUm6eelIVmV1VGMzIvJzNKZZTEs5qiqqi3n3ZvXkRbgHd2iZeSn6SajnpaUlA8Ky4pJDNLapzBqJqjq6u1l3dwXk1oin19k6Gaoq2nkHdbX1U8MzUzNUZjir3Ns7C5wMTAm4h5ZWeKmYyUq7a7w764oIZ4eGdXUk5MVGeGstrItLzCw8avhn1mVWaFf3ODlJWgnpeNcFhQTTcrKSclLkVqmLehmaOpr7aZdW5WT2mEenaHm6CurKaZfGVkXkg8OTg1QlmAsMmuqLK3wMijhX5mYn6Th4aVpam5t7Sji3d3cFxST01HVGmNs9S/sLW+x86vj4h1cYOblJGbqqy7v7upkn56d2VYUFBIU2WHqtLJs7a/ydC7l458c3+ZmJKaqay4wb6vmIR8e2xeUVJKUmKBo8vSurjBz9LHqJqLf4WZn5meqbS6xMG5p5GEg3toWFZQUV5xjKrRxKysvcO4q5eKfHR4jZWRkKKnq66pppF7bG9hSzs3PEBHVW6GsbaWlKSemKOWhHprYH6Qf3yNlYmXm5WPd2RjWkY4Oj5CSFRjb36UqpeChYyNmZaDdW1kZ3d3en6IiZCUj4h7ZlhTS0hOT0hNVF1jZ19aVVRig4h6eYOMkJWOinpubXiBfX+Ok5OboqSejoB6cWVkbmtmY2NjbXJvZ2JgZXGElJCOkpaWmJOJgHBocoGJjJednqCkqKCOgXJhYGhqY11bZGtze3x1bm1tbW50eoCAf4KIiYeAfXduZ2xubXR1eIKNj4yGgXhxa2ZkY2Zxc3eAg4N/hHx2cW5saWx0e4CIjpOOiIeIg4SFgHx/gYeNjImHh4OAfXVuaWZmYV5cXV5mam1saWZmYlxgYVxaW1tcY2ZmaWlqbnh6eHl+gYqSjo2MhoGHiIqQkY+Sl5WVmZCGhYKAhIeKjY6PkpiXjouJf4CDgH2BgH+FiISEgHZ0dXNzd3ZydXl1eXx7eHh2cnR2d3p8eHl7fXl7e3h4en1/gIKGiYmMj4uIhoaDg4OAgIKBg4aIh4mJg4ODgH+DhIWIiYqMjYuIiIaEhYaFh4qJjY6NjI2LiYqJh4WHiIqKiIaHiIaHh4SChoeHhIGBgoOGh4WGioaGkYmAgYeCen+AgYGBgIGBf4GCgH9+fXt6eHd3d3h4d3R1dXVzdHRwcG5tbG1ubW1raWpramprampra2lnZ2VkZWVnZ2dmaW1vbW1ra2xsbW9wbnF1dnh7e31/fH1+gH+AgYCAgoKBg4OEhYeJi4qJi46NjI+Qjo2Njo+QkZKUlZeYmJmZmJeXlpORkI2Mi4iHiIiFg4F/fHx7enl3dnR1dXV4enl6fHx+gH+AgoGCg4ODhYiJioyPjo2MjIyLi4yMi4yNjY2Njo6Ojo6NjYyMjIuLi4qKi4uKioqKi4uLi4yMjIyLioqJh4iHhYSCgYKEhIWHh4iJiYiIioqJiIiJiouKi42Oj46Pjo2LiYeHiIiHh4aGh4aEg4OCgYGAfn19fX17enl5eHh5eHh3dnd2dXRzcnFwbm1ucG9ub29wcXFvbGtqamprampsbW5vb29xcnJycnN0c3R2eHl6e3x8fH19fn9/f4CBgoODg4OEhoeJioqLjIuLiouLjY2MjIyMjo+PkJKSkZGRkZGRkJCQkZCRkY+QkZCQkJCQkY+Oj46OjIyMjY2NjY2Pjo6Pjo6Pjo6OjY2MjIuKiYmJiYmJiIeIiIiHh4aHh4eGhoaHiIeHh4eHh4eHhoaFhYWFhYSDg4OCgoKChISDg4SEhYWEhIODgoKBgYF/fn18e3t6enp5d3Z1dHNycXFwb25tbWxsbGtra2tsbGxtbm9vcHBwcXFxcnJzdHR0dXV2d3d4eHl6enh6enl5enp7enp7e3x7e3t6ent7e3t7e3t7e3x8fX5+f3+Af39/f39/f3+AgICAgICAgIB/f39/f39/fn9/f359fX19fXx8e3x8fX19fn59fX19fH19fX19fX1+fn5+fn5+fn9/fX5+fn5/fn9/fn5+f3+Af4CAgIGBgYGCgYGAgYGBgYGBgYGBgYGBgoGCgoKCgoODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4KCgoKCgoKCg4KCgoKBgYCAgH9/f39/f35+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn9/f4CAgICBgYGBgYGBgYKCgoKCg4KDgoODg4ODg4ODg4SEhISEhISEhISEhISEhISEhYSFhISEhISEhISEhISEhISDg4ODg4ODg4ODgoKCgoKCgoKCgYGBgICAgH9/f39/fn5+fn5+fn5+fn5+fn5+fn9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3+AgH9/f39/f39/f35+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fX19fX19fX19fX19fX19fn5+fn5+fn5+fn5/f39/f39/f39/f4CAgICAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f4B/gICAgICAgIB/gICAf39/f39/f39/gICAgIA="  // base64 encoded
    */
  }
};

function SourceBlock(data, serialPort) {
  this.data = data;
  this.serialPort = serialPort;
}

SourceBlock.prototype.setBusy = function(busy) {
  digitalWrite(LED1, 0+busy);  // Red = busy
  digitalWrite(LED2, 0+(!busy));  // Green = waiting
};

SourceBlock.prototype.onConnect = function(e) {
  this.setBusy(true);

  var strRepresentation = JSON.stringify(this.data);
  //console.log("Connected - sending object", strRepresentation);
  this.serialPort.print(strRepresentation + '\u0004');

  this.setBusy(false);
};

SourceBlock.prototype.setUp = function() {

  USB.setConsole();

  /**** Set up inputs ****/

  pinMode(B3, 'input_pulldown');  // Listen for connection from later block

  /**** Set up outputs ****/

  this.serialPort.setup(9600, { tx:B6, rx:B7 });  // Data connection
  this.setBusy(false);                 // Display indicator

  /**** Behaviours ****/

  setWatch(function(e) {
    setTimeout(function() {
      if(digitalRead(B3) === 1) { // Check for debounce issues
        this.onConnect(e);
      }
    }.bind(this), 500);   // Wait for debounce and then check empirically whether connection exists
  }.bind(this),  B3, { repeat: true, edge: 'rising', debounce:100 });  // On connection, output block data
};

var block = new SourceBlock(blockData, Serial1);

E.on('init', block.setUp.bind(block));
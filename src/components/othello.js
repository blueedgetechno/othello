import React from 'react'

import * as engine from './reversi/engine.js';

import {
  Undo,
  NewGame,
  SwitchColor,
  UserHuman,
  PlayerComputer,
  LastMove,
  CheckMark
} from './icons'

import './othello.css';

export default class Othello extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      a : [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1, 1, 0,-1,-1,-1],
        [-1,-1,-1, 0, 1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]

      ],
      prev: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1, 1, 0,-1,-1,-1],
        [-1,-1,-1, 0, 1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
      ],
      turn : 0,
      demo: 0,
      winner: -1,
      black: 2,
      white: 2,
      player: 0,
      human: 0,
      passes: 0,
      showLast: true,
      showAvail: true,
      last: [-1,-1]
    }
  }

  reset(){
    this.setState({
      a : [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1, 1, 0,-1,-1,-1],
        [-1,-1,-1, 0, 1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
      ],
      prev: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1, 1, 0,-1,-1,-1],
        [-1,-1,-1, 0, 1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
      ],
      turn : 0,
      demo: 0,
      winner: -1,
      black: 2,
      white: 2,
      passes: 0,
      last: [-1,-1]
    }, ()=>{
      this.validMoves()
      this.move(3,3)
    })
  }

  gameResult(comp = 0){
    var a = this.state.a

    var neg = 0,
        one = 0,
        zero = 0

    for (var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if(a[i][j]<0){
          neg+=1
        }else if (a[i][j]==1) {
          one+=1
        }else{
          zero+=1
        }
      }
    }

    if(neg==0 || comp){
      var winner = 2;
      if(one>zero){
        winner = 1
      }
      if(zero>one){
        winner = 0
      }
      this.setState({black: zero, white: one,winner: winner, demo: this.state.demo^1})
    }else{
      this.setState({black: zero, white: one, demo: this.state.demo^1})
    }
  }

  isValid(i,j){
    return i>=0 && i<8 && j>=0 && j<8
  }

  isAllowed(i,j){
    // console.log("Al");
    var a = this.state.a
    var t = this.state.turn

    // console.log("Al",t);

    if(a[i][j]>=0){
      return 0
    }

    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        if(x!=0 || y!=0){
          var tot = 0
          var m = i, n = j;

          while(this.isValid(m+x,n+y)){
            if(a[m+x][n+y]!=(t^1)){
              if(a[m+x][n+y]<0){
                tot = 0
              }
              // console.log("Un");
              if(tot){
                return 1
              }
              break
            }
            tot+=1
            m+=x
            n+=y
          }
        }
      }
    }

    // console.log("Log");
    return 0
  }

  updateBoard(i,j){
    var a = this.state.a
    var t = this.state.turn^1

    // console.log("Update",t,i,j);

    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        if(x!=0 || y!=0){
          var tot = 0
          var f = 0
          var m = i, n = j;
          while(this.isValid(m+x,n+y)){
            if(a[m+x][n+y]!=(t^1)){
              if(a[m+x][n+y]<0){
                tot = 0
              }else{
                f = 1
              }
              break
            }
            tot+=1
            m+=x
            n+=y
          }


          if(tot && f){
            // console.log("Lol");
            m = i
            n = j

            while(this.isValid(m+x,n+y)){
              if(a[m+x][n+y]!=(t^1)){
                break
              }
              a[m+x][n+y]^=1
              m+=x
              n+=y
            }

          }
        }
      }
    }

    this.setState({a:a, demo: this.state.demo^1},()=>{
      this.validMoves();
      this.gameResult();
    })
  }

  validMoves(){
    if(this.state.winner>=0) return

    if(this.state.passes>1){
      this.gameResult(1)
    }

    var a = this.state.a
    // var t = this.state.turn
    var count = 0
    // console.log("valid",t);

    for (var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if(a[i][j]<0){
          if(this.isAllowed(i,j)){
            a[i][j] = -2
            count+=1
            // console.log(i,j,-2)
          }else{
            a[i][j] = -1
          }
        }
      }
    }

    if(count==0){
      if(this.state.passes<2){
        setTimeout(()=>{
          this.setState({a:a, passes: this.state.passes+1, turn: this.state.turn^1},()=>{
            this.validMoves()
            if(this.state.turn==(this.state.player^1) && this.state.human==0){
              setTimeout(()=>{
                this.opponent()
              },400)
            }
          })
        },300);
      }
    }else{
      this.setState({a:a,passes: 0,demo: this.state.demo^1})
    }
  }

  bestMove(){
    var a = this.state.a,
        st = ""

    for (var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if(a[i][j]<0){
          st+=" "
        }else if (a[i][j]^this.state.player) {
          st+="X"
        }else{
          st+="O"
        }
      }
    }

    var boardString = engine.createInitialState(st);
    var player = 'X';
    console.log(player);
    var maxPly = 5;

    try {
      var result = engine.findBestMove(boardString, player, maxPly);
      console.log("Best move");
      return [result.bestRow, result.bestColumn]
    }catch (error) {
      console.error('engine.findBestMove() threw an exception:', error);
      return [-1,-1]
    }
  }

  checkInclution(b,x){
    for (var i = 0; i < b.length; i++) {
      if(b[i][0]==x[0]&&b[i][1]==x[1]) return true
    }

    return false;
  }

  opponent(){
    console.log("Opponent");
    if(this.state.winner>=0 || this.state.human) return

    if(this.state.turn!=(this.state.player^1)) return

    var a = this.state.a,
      t = this.state.turn,
      b = []

    for (var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if(a[i][j]==-2){
          b.push([i,j])
        }
      }
    }

    if(b.length){
      var x = this.bestMove()
      if(x[0]+1==0 || this.checkInclution(b,x)==false){
        console.log("Random");
        x = b[Math.floor(Math.random()*b.length)]
      }

      a[x[0]][x[1]] = t
      this.setState({a:a,last: [x[0],x[1]],turn:this.state.turn^1},()=>{
        this.updateBoard(x[0],x[1])
      })
    }
  }

  undoMove(){
    if(this.state.human) return
    console.log("undoMove");
    this.setState({a: this.state.prev},()=>{
      this.validMoves();
      this.gameResult();
    })
  }

  move(i,j){
    // console.log("Move");
    if(this.state.winner>=0) return

    if(this.state.turn==(this.state.player^1) && this.state.human==0){
      setTimeout(()=>{
        this.opponent()
      },400)
      return
    }

    var a = this.state.a
    var b = a.map(arr=>arr.slice());
    var t = this.state.turn

    if(a[i][j]<0 && this.isAllowed(i,j)){
      // console.log("isAllowed");
      a[i][j] = t
      // console.log(a[i][j]==b[i][j]);
      this.setState({a:a, prev: b,last: [i,j],turn:this.state.turn^1},()=>{
        this.updateBoard(i,j)
        setTimeout(()=>{
          this.opponent()
        },400)
      })
    }
  }

  humanGame(){
    this.setState({
      human: this.state.human^1
    },()=>{
      this.reset();
    })
  }

  switchColor(){
    if(this.state.human) return

    this.setState({
      player: this.state.player^1
    },()=>{
      this.reset();
    })
  }

  toggleLastMove(){
    this.setState({showLast: this.state.showLast^1})
  }

  toggleAvailMoves(){
    this.setState({showAvail: this.state.showAvail^1})
  }

  componentWillMount(){
    this.validMoves()
  }

  render() {
    return (
      <div className="othello-game">
        <div className="score">
          <div className={this.state.turn==0?"points outlined":"points"}><div className="demopiece"></div><span>{this.state.black}</span></div>
          <div className={this.state.turn==1?"points outlined":"points"}><div className="demopiece white"></div><span>{this.state.white}</span></div>
        </div>
        <div className="gamescreen">
          <div className="board">
            {this.state.a.map((row,i)=>{
              return row.map((box,j)=>{
                return(
                  <div className="box" onClick={()=>{
                    this.move(i,j)
                  }}>
                    {box>=0?(
                      <div className={box==1 ? "piece":"piece back" }>
                        <div className="white"></div>
                        <div className="black"></div>
                      </div>
                    ):null}
                    {box>=0 && this.state.showLast && i==this.state.last[0] && j==this.state.last[1]?(
                      <div className="last"></div>
                    ):null}
                    {box==-2 && this.state.showAvail? (
                      <div className={this.state.turn==1 ? "avail":"avail avail-black"}></div>
                    ):null}
                  </div>
                )
              })
            })}
          </div>
          <div className="oth-options">
            <div className="playoption">
              <div className="svgcontainer" onClick={this.undoMove.bind(this)}>
                <Undo/>
              </div>
              <span>
                Undo
              </span>
            </div>
            <div className="playoption">
              <div className="svgcontainer" onClick={this.reset.bind(this)}>
                <NewGame/>
              </div>
              <span>
                New
              </span>
            </div>
            <div className="playoption">
              <div className="svgcontainer" onClick={this.humanGame.bind(this)} title="Against a human (get a friend)">
                {this.state.human?<UserHuman/>:<PlayerComputer/>}
              </div>
              <span>
                {this.state.human?"Human":"Computer"}
              </span>
            </div>
            <div className="playoption">
              <div className="svgcontainer" onClick={this.switchColor.bind(this)} title="switch color of your player">
                <SwitchColor/>
              </div>
              <span>
                Black
              </span>
            </div>
            <div className="playoption">
              <div className="svgcontainer" onClick={this.toggleLastMove.bind(this)}>
                <LastMove/>
              </div>
              <span>
                Last move
              </span>
            </div>
            <div className="playoption">
              <div className="svgcontainer" onClick={this.toggleAvailMoves.bind(this)}>
                <CheckMark/>
              </div>
              <span>
                Available move
              </span>
            </div>
          </div>
        </div>
        {this.state.winner>=0?(
          <div className="winnercontainer">
            <div className="winnercard">
              <span className="result">
                {this.state.winner==0?"Black":null}
                {this.state.winner==1?"White":null}
                {this.state.winner<2?" won":null}
                {this.state.winner==2?"Draw":null}
              </span>
              <span className="again" onClick={this.reset.bind(this)}>Play again</span>
            </div>
          </div>
        ):null}
      </div>
    )
  }
}


// [0, 0, 0, 0, 0, 0, 1, -1],
// [0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 1, 0, 0, 0, 0],
// [1, 1, 1, 0, 1, 1, 1, 1],
// [1, 1, 1, 1, 1, 1, 1, 1],
// [1, 1, 1, 1, 1, 1, 1, 1],
// [1, 1, 1, 1, 1, 1, 1, 1]

// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [1,-1,-1,-1,-1,-1,-1,-1],
// [1,1,-1,-1,-1,-1,-1,-1],
// [1,1,1,-1,-1,-1,-1,-1],
// [0,1,-1,1,-1,-1,-1,-1]

// [-1,-1,-1,-1,-1,-1,-1,1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [1,-1,-1,-1,-1,-1,-1,-1],
// [0,-1,-1,-1,-1,-1,-1,-1]

// [-1,-1,-1,-1,-1,-1,-1,1],
// [-1,-1,-1,-1,-1,-1,-1,0],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,0],
// [-1,-1,-1,-1,-1,-1,-1,-1],
// [-1,-1,-1,-1,-1,-1,-1,0],
// [1,-1,-1,-1,-1,-1,-1,-1],
// [0,-1,-1,-1,-1,-1,-1,-1]
